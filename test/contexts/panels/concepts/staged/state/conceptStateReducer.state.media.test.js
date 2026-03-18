import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'
import { stateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import * as media from '@/lib/concept/state/media'
import { isStateModified } from '@/lib/concept/state/state'
import { CONCEPT_STATE } from '@/lib/constants/conceptState'
import { describe, expect, it } from 'vitest'

const { MEDIA_ITEM } = CONCEPT_STATE

const baseStagedState = {
  aliasIndex: 0,
  aliases: [],
  author: { action: 'None', value: '' },
  children: [],
  deleteConcept: false,
  media: [],
  mediaIndex: 0,
  name: { action: 'None', value: '', extent: '' },
  parent: { action: 'None', value: '' },
  rank: { action: 'None', level: '', name: '' },
  realizations: [],
  realizationIndex: 0,
  templates: [],
}

const initialState = { ...baseStagedState }
const cloneMedia = mediaItems => mediaItems.map(item => ({ ...item }))

const countPrimaryByType = mediaItems =>
  mediaItems.reduce((acc, item) => {
    if (!item.isPrimary) return acc
    const key = (item.mediaType || '').toUpperCase()
    return { ...acc, [key]: (acc[key] || 0) + 1 }
  }, {})

describe('conceptStateReducer media', () => {
  it('adds a media item and verifies isModified', () => {
    const mediaItem = {
      url: 'https://aqui.nada/image.jpg',
      mediaType: 'Image',
      isPrimary: false,
    }

    const stagedState = conceptStateReducer(baseStagedState, {
      type: MEDIA_ITEM.ADD,
      update: { mediaItem },
      initialState,
    })

    expect(stagedState.media).toHaveLength(1)
    expect(stagedState.media[0]).toMatchObject({
      url: 'https://aqui.nada/image.jpg',
      mediaType: 'Image',
      isPrimary: false,
      action: MEDIA_ITEM.ADD,
    })

    expect(media.isModified(initialState, stagedState)).toBe(true)
    expect(isStateModified({ initialState, stagedState })).toBe(true)
  })

  it('verifies stateUpdates from media matches reducer output', () => {
    const mediaItem = {
      url: 'https://aqui.nada/staged.jpg',
      mediaType: 'Image',
      isPrimary: false,
    }

    const stagedState = conceptStateReducer(baseStagedState, {
      type: MEDIA_ITEM.ADD,
      update: { mediaItem },
      initialState,
    })

    const mediaStateUpdates = media.stateUpdates(initialState, stagedState)
    expect(mediaStateUpdates.media).toBeDefined()
    expect(mediaStateUpdates.media.initial).toEqual([])
    expect(mediaStateUpdates.media.staged).toHaveLength(1)
    expect(mediaStateUpdates.media.staged[0]).toMatchObject({
      url: 'https://aqui.nada/staged.jpg',
      mediaType: 'Image',
      isPrimary: false,
      action: MEDIA_ITEM.ADD,
    })

    const fullStateUpdates = stateUpdates(initialState, stagedState)
    expect(fullStateUpdates.media).toBeDefined()
    expect(fullStateUpdates.media.initial).toEqual([])
    expect(fullStateUpdates.media.staged).toEqual(stagedState.media)
  })

  it('edits the added media item and verifies new staged values', () => {
    const mediaItem = {
      url: 'https://aqui.nada/original.jpg',
      mediaType: 'Image',
      isPrimary: false,
    }

    let stagedState = conceptStateReducer(baseStagedState, {
      type: MEDIA_ITEM.ADD,
      update: { mediaItem },
      initialState,
    })

    stagedState = conceptStateReducer(stagedState, {
      type: MEDIA_ITEM.EDIT,
      update: {
        mediaIndex: 0,
        mediaItem: { url: 'https://aqui.nada/edited.jpg' },
      },
      initialState,
    })

    expect(stagedState.media).toHaveLength(1)
    expect(stagedState.media[0].url).toBe('https://aqui.nada/edited.jpg')

    const mediaStateUpdates = media.stateUpdates(initialState, stagedState)
    expect(mediaStateUpdates.media.staged[0].url).toBe('https://aqui.nada/edited.jpg')
  })

  it('deletes the added media item and verifies isModified is false', () => {
    const mediaItem = {
      url: 'https://aqui.nada/to-delete.jpg',
      mediaType: 'Image',
      isPrimary: false,
    }

    let stagedState = conceptStateReducer(baseStagedState, {
      type: MEDIA_ITEM.ADD,
      update: { mediaItem },
      initialState,
    })

    expect(stagedState.media).toHaveLength(1)
    expect(media.isModified(initialState, stagedState)).toBe(true)

    stagedState = conceptStateReducer(stagedState, {
      type: MEDIA_ITEM.DELETE,
      update: { mediaIndex: 0 },
      initialState,
    })

    expect(stagedState.media).toHaveLength(0)
    expect(media.isModified(initialState, stagedState)).toBe(false)
    expect(isStateModified({ initialState, stagedState })).toBe(false)

    const mediaStateUpdates = media.stateUpdates(initialState, stagedState)
    expect(mediaStateUpdates).toEqual({})
  })

  it('full flow: add, verify stateUpdates, edit, verify, delete, verify isModified false', () => {
    const mediaItem = {
      url: 'https://aqui.nada/dingo.jpg',
      mediaType: 'Image',
      isPrimary: false,
    }

    let stagedState = conceptStateReducer(baseStagedState, {
      type: MEDIA_ITEM.ADD,
      update: { mediaItem },
      initialState,
    })

    expect(stagedState.media).toHaveLength(1)
    expect(stagedState.media[0].url).toBe('https://aqui.nada/dingo.jpg')
    expect(isStateModified({ initialState, stagedState })).toBe(true)

    let updates = media.stateUpdates(initialState, stagedState)
    expect(updates.media.initial).toEqual([])
    expect(updates.media.staged[0]).toMatchObject({
      url: 'https://aqui.nada/dingo.jpg',
      mediaType: 'Image',
      action: MEDIA_ITEM.ADD,
    })

    stagedState = conceptStateReducer(stagedState, {
      type: MEDIA_ITEM.EDIT,
      update: {
        mediaIndex: 0,
        mediaItem: { url: 'https://aqui.nada/dingo-updated.jpg' },
      },
      initialState,
    })

    expect(stagedState.media[0].url).toBe('https://aqui.nada/dingo-updated.jpg')

    updates = media.stateUpdates(initialState, stagedState)
    expect(updates.media.staged[0].url).toBe('https://aqui.nada/dingo-updated.jpg')

    stagedState = conceptStateReducer(stagedState, {
      type: MEDIA_ITEM.DELETE,
      update: { mediaIndex: 0 },
      initialState,
    })

    expect(stagedState.media).toHaveLength(0)
    expect(isStateModified({ initialState, stagedState })).toBe(false)
    expect(media.stateUpdates(initialState, stagedState)).toEqual({})
  })

  it('adding a primary media item demotes existing primary of same type without mutating input state', () => {
    const existingImagePrimary = {
      stateId: 'img-1',
      url: 'https://aqui.nada/image-1.jpg',
      mediaType: 'Image',
      isPrimary: true,
      action: CONCEPT_STATE.NO_ACTION,
    }
    const existingVideoPrimary = {
      stateId: 'vid-1',
      url: 'https://aqui.nada/video-1.mp4',
      mediaType: 'Video',
      isPrimary: true,
      action: CONCEPT_STATE.NO_ACTION,
    }

    const stagedState = {
      ...baseStagedState,
      media: [existingImagePrimary, existingVideoPrimary],
    }
    const priorSnapshot = cloneMedia(stagedState.media)

    const result = conceptStateReducer(stagedState, {
      type: MEDIA_ITEM.ADD,
      update: {
        mediaItem: {
          url: 'https://aqui.nada/image-2.jpg',
          mediaType: 'Image',
          isPrimary: true,
        },
      },
      initialState: { ...baseStagedState, media: cloneMedia(stagedState.media) },
    })

    const imagePrimaries = result.media.filter(
      item => (item.mediaType || '').toUpperCase() === 'IMAGE' && item.isPrimary
    )
    expect(imagePrimaries).toHaveLength(1)
    expect(imagePrimaries[0].url).toBe('https://aqui.nada/image-2.jpg')

    const priorImage = result.media.find(item => item.stateId === 'img-1')
    expect(priorImage.isPrimary).toBe(false)
    expect(priorImage.wasPrimary).toBe(true)

    const unchangedVideo = result.media.find(item => item.stateId === 'vid-1')
    expect(unchangedVideo).toBe(existingVideoPrimary)

    expect(stagedState.media).toEqual(priorSnapshot)
  })

  it('deleting a newly added primary restores prior same-type primary without mutating input state', () => {
    const restoredCandidate = {
      stateId: 'img-1',
      url: 'https://aqui.nada/image-1.jpg',
      mediaType: 'Image',
      isPrimary: false,
      wasPrimary: true,
      action: CONCEPT_STATE.NO_ACTION,
    }
    const addedPrimary = {
      stateId: 'img-2',
      url: 'https://aqui.nada/image-2.jpg',
      mediaType: 'Image',
      isPrimary: true,
      action: MEDIA_ITEM.ADD,
    }
    const stagedState = {
      ...baseStagedState,
      media: [restoredCandidate, addedPrimary],
    }
    const priorSnapshot = cloneMedia(stagedState.media)

    const result = conceptStateReducer(stagedState, {
      type: MEDIA_ITEM.DELETE,
      update: { mediaIndex: 1 },
      initialState: { ...baseStagedState, media: cloneMedia(stagedState.media) },
    })

    expect(result.media).toHaveLength(1)
    expect(result.media[0].stateId).toBe('img-1')
    expect(result.media[0].isPrimary).toBe(true)
    expect(result.media[0].wasPrimary).toBeUndefined()

    expect(stagedState.media).toEqual(priorSnapshot)
  })

  it('editing a primary image into video promotes remaining image primary and demotes other video primary', () => {
    const imagePrimary = {
      stateId: 'img-1',
      url: 'https://aqui.nada/image-1.jpg',
      mediaType: 'Image',
      isPrimary: true,
      action: CONCEPT_STATE.NO_ACTION,
    }
    const imageSecondary = {
      stateId: 'img-2',
      url: 'https://aqui.nada/image-2.jpg',
      mediaType: 'Image',
      isPrimary: false,
      action: CONCEPT_STATE.NO_ACTION,
    }
    const videoPrimary = {
      stateId: 'vid-1',
      url: 'https://aqui.nada/video-1.mp4',
      mediaType: 'Video',
      isPrimary: true,
      action: CONCEPT_STATE.NO_ACTION,
    }

    const stagedState = {
      ...baseStagedState,
      media: [imagePrimary, imageSecondary, videoPrimary],
    }
    const initialStateWithMedia = { ...baseStagedState, media: cloneMedia(stagedState.media) }
    const priorSnapshot = cloneMedia(stagedState.media)

    const result = conceptStateReducer(stagedState, {
      type: MEDIA_ITEM.EDIT,
      update: {
        mediaIndex: 0,
        mediaItem: { url: 'https://aqui.nada/video-2.mp4' },
      },
      initialState: initialStateWithMedia,
    })

    const byId = id => result.media.find(item => item.stateId === id)
    expect(byId('img-2').isPrimary).toBe(true)
    expect(byId('vid-1').isPrimary).toBe(false)
    expect(byId('img-1').mediaType).toBe('VIDEO')
    expect(byId('img-1').isPrimary).toBe(true)

    const primaryCounts = countPrimaryByType(result.media)
    expect(primaryCounts.IMAGE).toBe(1)
    expect(primaryCounts.VIDEO).toBe(1)

    expect(stagedState.media).toEqual(priorSnapshot)
  })

  it('deleting an existing primary promotes another same-type item and marks promotion as edit', () => {
    const imagePrimary = {
      stateId: 'img-1',
      url: 'https://aqui.nada/image-1.jpg',
      mediaType: 'Image',
      isPrimary: true,
      action: CONCEPT_STATE.NO_ACTION,
    }
    const imageSecondary = {
      stateId: 'img-2',
      url: 'https://aqui.nada/image-2.jpg',
      mediaType: 'Image',
      isPrimary: false,
      action: CONCEPT_STATE.NO_ACTION,
    }
    const stagedState = {
      ...baseStagedState,
      media: [imagePrimary, imageSecondary],
    }
    const initialStateWithMedia = { ...baseStagedState, media: cloneMedia(stagedState.media) }

    const result = conceptStateReducer(stagedState, {
      type: MEDIA_ITEM.DELETE,
      update: { mediaIndex: 0 },
      initialState: initialStateWithMedia,
    })

    expect(result.media[0].action).toBe(MEDIA_ITEM.DELETE)
    expect(result.media[0].isPrimary).toBe(false)
    expect(result.media[1].isPrimary).toBe(true)
    expect(result.media[1].action).toBe(MEDIA_ITEM.EDIT)
  })
})
