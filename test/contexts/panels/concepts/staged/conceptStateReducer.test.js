import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'
import { CONCEPT_STATE } from '@/lib/constants/conceptState'
import { describe, expect, it } from 'vitest'

const { ALIAS, AUTHOR, CHILD, MEDIA_ITEM, NAME, PARENT, RANK, REALIZATION, RESET } = CONCEPT_STATE

const baseStagedState = {
  aliases: [],
  author: { action: 'None', value: '' },
  children: [],
  media: [],
  mediaIndex: 0,
  name: { action: 'None', value: '', extent: '' },
  parent: { action: 'None', value: '' },
  rank: { action: 'None', level: '', name: '' },
  realizations: [],
  realizationIndex: 0,
}

describe('conceptStateReducer', () => {
  describe('CONCEPT_STATE.INITIAL', () => {
    it('returns update as the new state', () => {
      const update = { ...baseStagedState, name: { value: 'Initial' } }
      const result = conceptStateReducer(baseStagedState, {
        type: CONCEPT_STATE.INITIAL,
        update,
      })
      expect(result).toBe(update)
      expect(result.name.value).toBe('Initial')
    })
  })

  describe('ALIAS', () => {
    it('ADD: appends alias to aliases array', () => {
      const update = { aliasItem: { id: 'a1', name: 'New Alias', nameType: 'Common', author: '' } }
      const result = conceptStateReducer(baseStagedState, {
        type: ALIAS.ADD,
        update,
        initialState: baseStagedState,
      })
      expect(result.aliases).toHaveLength(1)
      expect(result.aliases[0].name).toBe('New Alias')
      expect(result.aliasIndex).toBe(0)
    })

    it('DELETE: removes added alias from state', () => {
      const stagedState = {
        ...baseStagedState,
        aliases: [{ name: 'Added', action: ALIAS.ADD, index: 0 }],
      }
      const result = conceptStateReducer(stagedState, {
        type: ALIAS.DELETE,
        update: { aliasIndex: 0 },
        initialState: baseStagedState,
      })
      expect(result.aliases).toHaveLength(0)
    })

    it('EDIT: updates alias at index', () => {
      const stagedState = {
        ...baseStagedState,
        aliases: [{ id: 'a1', name: 'Original', nameType: 'Common', author: '', action: 'None' }],
      }
      const result = conceptStateReducer(stagedState, {
        type: ALIAS.EDIT,
        update: { aliasIndex: 0, aliasItem: { name: 'Updated' } },
        initialState: baseStagedState,
      })
      expect(result.aliases[0].name).toBe('Updated')
    })
  })

  describe('AUTHOR', () => {
    it('updates author value', () => {
      const result = conceptStateReducer(baseStagedState, {
        type: AUTHOR,
        update: { value: 'J. Smith' },
        initialState: baseStagedState,
      })
      expect(result.author.value).toBe('J. Smith')
      expect(result.author.action).toBe(AUTHOR)
    })
  })

  describe('CHILD', () => {
    it('ADD: appends child to children array', () => {
      const update = { child: { name: 'Child Concept', author: '', rankLevel: '', rankName: '' } }
      const result = conceptStateReducer(baseStagedState, {
        type: CHILD.ADD,
        update,
        initialState: baseStagedState,
      })
      expect(result.children).toHaveLength(1)
      expect(result.children[0].name).toBe('Child Concept')
      expect(result.children[0].action).toBe(CHILD.ADD)
    })
  })

  describe('MEDIA_ITEM', () => {
    it('ADD: appends media item', () => {
      const update = {
        mediaItem: { url: 'https://example.com/image.jpg', mediaType: 'Image', isPrimary: false },
      }
      const result = conceptStateReducer(baseStagedState, {
        type: MEDIA_ITEM.ADD,
        update,
        initialState: baseStagedState,
      })
      expect(result.media).toHaveLength(1)
      expect(result.media[0].url).toBe('https://example.com/image.jpg')
      expect(result.media[0].action).toBe(MEDIA_ITEM.ADD)
    })

    it('DELETE: removes added media from state', () => {
      const addedMedia = {
        url: 'https://example.com/img.jpg',
        mediaType: 'Image',
        action: MEDIA_ITEM.ADD,
      }
      const stagedState = {
        ...baseStagedState,
        media: [addedMedia],
      }
      const result = conceptStateReducer(stagedState, {
        type: MEDIA_ITEM.DELETE,
        update: { mediaIndex: 0 },
        initialState: baseStagedState,
      })
      expect(result.media).toHaveLength(0)
    })

    it('EDIT: updates media item at index', () => {
      const stagedState = {
        ...baseStagedState,
        media: [
          { stateId: 's1', url: 'https://old.com/img.jpg', mediaType: 'Image', action: 'None' },
        ],
      }
      const initialState = {
        media: [{ stateId: 's1', url: 'https://old.com/img.jpg', mediaType: 'Image' }],
      }
      const result = conceptStateReducer(stagedState, {
        type: MEDIA_ITEM.EDIT,
        update: { mediaIndex: 0, mediaItem: { url: 'https://new.com/img.jpg' } },
        initialState,
      })
      expect(result.media[0].url).toBe('https://new.com/img.jpg')
    })

    it('INDEX: updates value via editValue', () => {
      const result = conceptStateReducer(baseStagedState, {
        type: MEDIA_ITEM.INDEX,
        update: { field: 'mediaIndex', value: 2 },
        initialState: baseStagedState,
      })
      expect(result.mediaIndex).toBe(2)
    })
  })

  describe('NAME', () => {
    it('updates name fields', () => {
      const result = conceptStateReducer(baseStagedState, {
        type: NAME,
        update: { value: 'New Concept Name', extent: 'Full extent' },
        initialState: baseStagedState,
      })
      expect(result.name.value).toBe('New Concept Name')
      expect(result.name.extent).toBe('Full extent')
    })
  })

  describe('PARENT', () => {
    it('updates parent value', () => {
      const result = conceptStateReducer(baseStagedState, {
        type: PARENT,
        update: { value: 'Parent Concept' },
        initialState: baseStagedState,
      })
      expect(result.parent.value).toBe('Parent Concept')
      expect(result.parent.action).toBe(PARENT)
    })
  })

  describe('RANK', () => {
    it('updates rank fields', () => {
      const result = conceptStateReducer(baseStagedState, {
        type: RANK,
        update: { level: 'Species', name: 'Animalia' },
        initialState: baseStagedState,
      })
      expect(result.rank.level).toBe('Species')
      expect(result.rank.name).toBe('Animalia')
    })
  })

  describe('REALIZATION', () => {
    it('ADD: appends realization', () => {
      const update = {
        realizationItem: { linkName: 'sameAs', toConcept: 'Other', linkValue: 'x' },
      }
      const result = conceptStateReducer(baseStagedState, {
        type: REALIZATION.ADD,
        update,
        initialState: baseStagedState,
      })
      expect(result.realizations).toHaveLength(1)
      expect(result.realizations[0].linkName).toBe('sameAs')
      expect(result.realizations[0].action).toBe(REALIZATION.ADD)
    })

    it('DELETE: removes added realization', () => {
      const stagedState = {
        ...baseStagedState,
        realizations: [{ linkName: 'sameAs', action: REALIZATION.ADD, index: 0 }],
      }
      const result = conceptStateReducer(stagedState, {
        type: REALIZATION.DELETE,
        update: { realizationIndex: 0 },
        initialState: baseStagedState,
      })
      expect(result.realizations).toHaveLength(0)
    })

    it('EDIT: updates realization at index', () => {
      const stagedState = {
        ...baseStagedState,
        realizations: [
          { linkName: 'sameAs', toConcept: 'Old', linkValue: 'v', action: 'None', index: 0 },
        ],
      }
      const result = conceptStateReducer(stagedState, {
        type: REALIZATION.EDIT,
        update: { realizationIndex: 0, realizationItem: { toConcept: 'New' } },
        initialState: baseStagedState,
      })
      expect(result.realizations[0].toConcept).toBe('New')
    })
  })

  describe('RESET', () => {
    it('ALIASES: resets aliases from update', () => {
      const stagedState = { ...baseStagedState, aliases: [{ name: 'Staged' }] }
      const update = { aliases: [{ name: 'Reset' }] }
      const result = conceptStateReducer(stagedState, {
        type: RESET.ALIASES,
        update,
        initialState: baseStagedState,
      })
      expect(result.aliases).toEqual([{ name: 'Reset', index: 0 }])
    })

    it('AUTHOR: resets author from update', () => {
      const stagedState = { ...baseStagedState, author: { action: AUTHOR, value: 'Staged' } }
      const update = { author: { action: 'None', value: 'Initial' } }
      const result = conceptStateReducer(stagedState, {
        type: RESET.AUTHOR,
        update,
        initialState: baseStagedState,
      })
      expect(result.author).toEqual({ action: 'None', value: 'Initial' })
    })

    it('CHILD: resets single child at index', () => {
      const childToReset = { name: 'Reset Child', action: 'None', index: 1 }
      const stagedState = {
        ...baseStagedState,
        children: [
          { name: 'Keep', action: 'None', index: 0 },
          { name: 'Modified', action: 'Edit', index: 1 },
        ],
      }
      const result = conceptStateReducer(stagedState, {
        type: RESET.CHILD,
        update: { child: childToReset },
        initialState: baseStagedState,
      })
      expect(result.children[1]).toEqual(childToReset)
      expect(result.children[0].name).toBe('Keep')
    })

    it('CHILDREN: resets all children from update', () => {
      const stagedState = { ...baseStagedState, children: [{ name: 'Staged' }] }
      const update = { children: [{ name: 'Reset' }] }
      const result = conceptStateReducer(stagedState, {
        type: RESET.CHILDREN,
        update,
        initialState: baseStagedState,
      })
      expect(result.children).toEqual([{ name: 'Reset' }])
    })

    it('MEDIA: resets media from update', () => {
      const stagedState = { ...baseStagedState, media: [{ url: 'staged' }] }
      const update = { media: [{ url: 'reset', stateId: 's1' }] }
      const result = conceptStateReducer(stagedState, {
        type: RESET.MEDIA,
        update,
        initialState: baseStagedState,
      })
      expect(result.media).toEqual([{ url: 'reset', stateId: 's1' }])
    })

    it('NAME: resets name from update', () => {
      const stagedState = { ...baseStagedState, name: { value: 'Staged', extent: '' } }
      const update = { name: { action: 'None', value: 'Initial', extent: '' } }
      const result = conceptStateReducer(stagedState, {
        type: RESET.NAME,
        update,
        initialState: baseStagedState,
      })
      expect(result.name).toEqual({ action: 'None', value: 'Initial', extent: '' })
    })

    it('PARENT: resets parent from update', () => {
      const stagedState = { ...baseStagedState, parent: { action: PARENT, value: 'Staged' } }
      const update = { parent: { action: 'None', value: 'Initial' } }
      const result = conceptStateReducer(stagedState, {
        type: RESET.PARENT,
        update,
        initialState: baseStagedState,
      })
      expect(result.parent).toEqual({ action: 'None', value: 'Initial' })
    })

    it('RANK: resets rank from update', () => {
      const stagedState = { ...baseStagedState, rank: { level: 'Staged', name: 'Staged' } }
      const update = { rank: { action: 'None', level: 'Species', name: 'Animalia' } }
      const result = conceptStateReducer(stagedState, {
        type: RESET.RANK,
        update,
        initialState: baseStagedState,
      })
      expect(result.rank).toEqual({ action: 'None', level: 'Species', name: 'Animalia' })
    })

    it('REALIZATIONS: resets realizations from update', () => {
      const stagedState = { ...baseStagedState, realizations: [{ linkName: 'Staged' }] }
      const update = { realizations: [{ linkName: 'Reset' }] }
      const result = conceptStateReducer(stagedState, {
        type: RESET.REALIZATIONS,
        update,
        initialState: baseStagedState,
      })
      expect(result.realizations).toEqual([{ linkName: 'Reset' }])
    })
  })

  describe('default', () => {
    it('returns stagedState unchanged for unknown action type', () => {
      const stagedState = { ...baseStagedState, name: { value: 'Unchanged' } }
      const result = conceptStateReducer(stagedState, {
        type: 'UNKNOWN_ACTION',
        update: {},
        initialState: baseStagedState,
      })
      expect(result).toBe(stagedState)
      expect(result.name.value).toBe('Unchanged')
    })
  })
})
