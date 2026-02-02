import { getItemMediaType, getMediaType, isPrimary, MEDIA_TYPES, mediaOfType } from '@/lib/model/media'

import { stagedEdits } from '@/lib/concept/state/staged'

import { ACTION } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

const addMedia = (state, update) => {
  const mediaType = getMediaType(update.mediaItem.url)
  const sameTypeMedia = mediaOfType(state.media, mediaType)
  const isPrimaryMedia = mediaType
    ? sameTypeMedia.length === 0 || isPrimary(update.mediaItem)
    : isPrimary(update.mediaItem)
  const mediaIndex = state.media.length
  const mediaItem = {
    ...update.mediaItem,
    action: CONCEPT_STATE.MEDIA_ITEM.ADD,
    isPrimary: isPrimaryMedia,
    index: mediaIndex,
  }
  return {
    ...state,
    media: [...state.media, mediaItem],
    mediaIndex,
  }
}

const deleteMedia = (state, update) => {
  const mediaItem = state.media[update.mediaIndex]
  // If media is an add, just remove it from state
  if (mediaItem.action === CONCEPT_STATE.MEDIA_ITEM.ADD) {
    const updatedMedia = state.media.filter((_item, index) => index !== update.mediaIndex)
    return {
      ...state,
      media: updatedMedia,
    }
  }
  return updateState(state, { type: CONCEPT_STATE.MEDIA_ITEM.DELETE, update })
}

const editMedia = (state, update) => {
  const mediaItem = state.media[update.mediaIndex]
  // If editing an added media item, don't change the action
  if (mediaItem.action === CONCEPT_STATE.MEDIA_ITEM.ADD) {
    const updatedItem = {
      ...update.mediaItem,
      action: CONCEPT_STATE.MEDIA_ITEM.ADD,
    }
    return {
      ...state,
      media: state.media.map((item, index) => (index === update.mediaIndex ? updatedItem : item)),
    }
  }
  return updateState(state, { type: CONCEPT_STATE.MEDIA_ITEM.EDIT, update })
}

const isMatching = (mediaItem, pendingMediaItem) => {
  const pendingMediaValue =
    pendingMediaItem.action === ACTION.DELETE
      ? pendingMediaItem.oldValue
      : pendingMediaItem.newValue
  return pendingMediaValue === mediaItem.url
}

const isPendingMedia = pendingItem => pendingItem.field === HISTORY_FIELD.MEDIA

const mediaItemState = (mediaItem, pendingMedia) => {
  const pendingMediaItem = pendingMedia.find(pendingMediaItem =>
    isMatching(mediaItem, pendingMediaItem)
  )
  if (pendingMediaItem) {
    return {
      ...mediaItem,
      action: pendingMediaItem.action + ' Pending',
      historyId: pendingMediaItem.id,
    }
  }
  return { ...mediaItem, action: CONCEPT_STATE.NO_ACTION }
}

const mediaState = (concept, pendingConcept) => {
  const { media } = concept

  // Order media so that primaries come first
  const mediaKey = item => item.id ?? `${item.url}|${getItemMediaType(item) ?? 'UNKNOWN'}`

  // Collect primary of each known type, in MEDIA_TYPES order
  const primariesByType = MEDIA_TYPES.map(type =>
    media.find(item => getItemMediaType(item) === type && isPrimary(item)) || null
  )

  const primaries = []
  const primaryKeys = new Set()

  primariesByType.forEach(item => {
    if (!item) return
    const key = mediaKey(item)
    if (!primaryKeys.has(key)) {
      primaryKeys.add(key)
      primaries.push(item)
    }
  })

  // All other media (including unknown types) follow in the order received.
  const nonPrimaries = media.filter(item => !primaryKeys.has(mediaKey(item)))

  const orderedMedia = [...primaries, ...nonPrimaries]

  const pendingMedia = pendingConcept.filter(isPendingMedia)

  const stagedMedia = orderedMedia.map((mediaItem, index) =>
    mediaItemState({ ...mediaItem, index }, pendingMedia)
  )

  return { media: stagedMedia }
}

const resetMedia = (state, update) => {
  const { index: resetIndex } = update

  if (1 < state.media.length && resetIndex !== undefined) {
    const mediaItem = update.media[resetIndex]
    return {
      ...state,
      media: state.media.reduce((acc, item, index) => {
        index === resetIndex ? mediaItem != null && acc.push(mediaItem) : acc.push(item)
        return acc
      }, []),
    }
  }
  return {
    ...state,
    media: update.media,
  }
}

const stagedMediaEdits = stagedEdit => {
  const [_field, media] = stagedEdit

  return stagedEdits({
    displayFields: ['url', 'credit', 'caption', 'isPrimary'],
    initial: media.initial,
    staged: media.staged,
    stateTypes: CONCEPT_STATE.MEDIA_ITEM,
  })
}

const updateState = (state, { type, update }) => {
  const { mediaIndex, mediaItem } = update
  const updatedItem = { ...mediaItem, action: type }
  const updatedMedia = state.media.map((stateItem, stateIndex) =>
    stateIndex === mediaIndex ? updatedItem : stateItem
  )
  return { ...state, media: updatedMedia }
}

export {
  addMedia,
  deleteMedia,
  editMedia,
  isPendingMedia,
  mediaState,
  resetMedia,
  stagedMediaEdits,
}

