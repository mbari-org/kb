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
  const mediaIndex = update.mediaIndex
  const mediaItem = state.media[mediaIndex]

  // If media is an ADD, just remove it from state
  if (mediaItem.action === CONCEPT_STATE.MEDIA_ITEM.ADD) {
    const updatedMedia = state.media.filter((_item, index) => index !== mediaIndex)
    return {
      ...state,
      media: updatedMedia,
    }
  }

  const wasPrimary = !!mediaItem.isPrimary
  const mediaType = getMediaType(mediaItem.url)

  // mark as deleted and clear primary flag
  let media = state.media.map((item, index) =>
    index === mediaIndex
      ? { ...item, action: CONCEPT_STATE.MEDIA_ITEM.DELETE, isPrimary: false }
      : item
  )

  if (!wasPrimary || !mediaType) {
    return { ...state, media }
  }

  // Promote first remaining ADD/EDIT media of this type (but not DELETE)
  const candidateIndex = media.findIndex((item, index) => {
    if (index === mediaIndex) return false
    const itemType = getMediaType(item.url)
    if (itemType !== mediaType) return false
    if (item.action === CONCEPT_STATE.MEDIA_ITEM.DELETE) return false
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

  return { ...state, media }
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

  // Case 2: deselecting primary on an ADD/EDIT that WAS primary
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
      return { ...state, media }
    }

    const candidateIndex = media.findIndex((item, index) => {
      if (index === mediaIndex) return false
      const itemType = getMediaType(item.url)
      if (itemType !== mediaType) return false
      if (item.action === CONCEPT_STATE.MEDIA_ITEM.DELETE) return false
      // Only consider staged ADD/EDIT, not NO_ACTION
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

  // Order media so that primaries of each type come first
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

  // All other media (including unknown types) follow in server order.
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

export {
  addMedia,
  deleteMedia,
  editMedia,
  isPendingMedia,
  mediaState,
  resetMedia,
  stagedMediaEdits,
}

