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

  // If this new ADD is marked primary, demote any other staged ADDs of the same type
  const updatedMedia = isPrimaryMedia
    ? state.media.map(item => {
        const itemType = mediaType ? getMediaType(item.url) : null
        const isSameTypeAdd =
          item.action === CONCEPT_STATE.MEDIA_ITEM.ADD && itemType === mediaType
        return isSameTypeAdd ? { ...item, isPrimary: false } : item
      })
    : state.media

  const mediaIndex = updatedMedia.length
  const mediaItem = {
    ...update.mediaItem,
    action: CONCEPT_STATE.MEDIA_ITEM.ADD,
    isPrimary: isPrimaryMedia,
    index: mediaIndex,
  }

  return {
    ...state,
    media: [...updatedMedia, mediaItem],
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
  const mediaIndex = update.mediaIndex
  const currentItem = state.media[mediaIndex]

  const isAdd = currentItem.action === CONCEPT_STATE.MEDIA_ITEM.ADD
  const updatedItem = {
    ...update.mediaItem,
    action: isAdd ? CONCEPT_STATE.MEDIA_ITEM.ADD : CONCEPT_STATE.MEDIA_ITEM.EDIT,
  }

  const mediaType = getMediaType(updatedItem.url)
  const wasPrimary = !!currentItem.isPrimary
  const isPrimaryNow = !!updatedItem.isPrimary

  // First apply the direct edit
  let media = state.media.map((item, index) => (index === mediaIndex ? updatedItem : item))

  if (!mediaType) {
    return { ...state, media }
  }

  // Case 1: selecting primary true -> demote all other staged items of same type
  if (isPrimaryNow) {
    media = media.map((item, index) => {
      if (index === mediaIndex) return item

      const itemType = getMediaType(item.url)
      const isSameType = itemType === mediaType
      if (!isSameType) return item

      // Demote any other staged media of this type (ADD or EDIT), regardless of prior state
      return { ...item, isPrimary: false }
    })

    return { ...state, media }
  }

  // Case 2: deselecting primary on an item that WAS primary
  // Strategy:
  // - If there is an untouched concept.media primary of this type (NO_ACTION, isPrimary true),
  //   leave it alone and do NOT implicitly override it.
  // - Otherwise, promote the first staged media (ADD/EDIT, not DELETE) of this type.
  if (wasPrimary && !isPrimaryNow) {
    const hasUntouchedConceptPrimary = media.some((item, index) => {
      if (index === mediaIndex) return false
      const itemType = getMediaType(item.url)
      if (itemType !== mediaType) return false
      return item.action === CONCEPT_STATE.NO_ACTION && item.isPrimary
    })

    if (hasUntouchedConceptPrimary) {
      // Underlying concept already has a primary of this type we haven't staged; respect it.
      return { ...state, media }
    }

    const candidateIndex = media.findIndex((item, index) => {
      if (index === mediaIndex) return false
      const itemType = getMediaType(item.url)
      if (itemType !== mediaType) return false
      if (item.action === CONCEPT_STATE.MEDIA_ITEM.DELETE) return false
      // Only consider staged items (ADD or EDIT), not untouched NO_ACTION items
      if (item.action === CONCEPT_STATE.NO_ACTION) return false
      return true
    })

    if (candidateIndex !== -1) {
      media = media.map((item, index) => {
        const itemType = getMediaType(item.url)
        if (itemType !== mediaType) return item
        if (index === candidateIndex) return { ...item, isPrimary: true }
        return { ...item, isPrimary: false }
      })
    }
  }

  return { ...state, media }
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

