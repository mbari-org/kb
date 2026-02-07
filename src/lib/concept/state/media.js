import { getItemMediaType, getMediaType, isPrimary } from '@/lib/model/media'

import { stagedEdits } from '@/lib/concept/state/staged'

import { ACTION, MEDIA } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

const mediaItemKey = item => item.id ?? `${item.url}|${getItemMediaType(item) ?? 'UNKNOWN'}`

const ensureAction = item => (item.action ? item : { ...item, action: CONCEPT_STATE.NO_ACTION })

const orderMediaByPrimary = media => {
  const itemsWithAction = media.map(ensureAction)
  const primaries = MEDIA.ORDER
    .map(type => itemsWithAction.find(item => getItemMediaType(item) === type && isPrimary(item)) || null)
    .filter(Boolean)

  return [...primaries, ...itemsWithAction.filter(item => !isPrimary(item))]
}

const addMedia = (state, update) => {
  const addingItem = {
    ...update.mediaItem,
    action: CONCEPT_STATE.MEDIA_ITEM.ADD,
  }

  const newStateMedia = [...state.media, addingItem]

  let orderedMedia = newStateMedia
  if (addingItem.isPrimary) {
    newStateMedia.forEach(item => {
      if (item !== addingItem && getMediaType(item.url) === getMediaType(addingItem.url)) {
        if (item.isPrimary) {
          item.isPrimary = false
          item.wasPrimary = true
        }
      }
    })
    orderedMedia = orderMediaByPrimary(newStateMedia)
  }

  const orderedIndex = orderedMedia.findIndex(item => mediaItemKey(item) === mediaItemKey(addingItem))

  return {
    ...state,
    media: orderedMedia,
    mediaIndex: orderedIndex === -1 ? orderedMedia.length : orderedIndex,
  }
}

const deleteMedia = (state, update) => {
  const deletingIndex = update.mediaIndex
  const deletingItem = state.media[deletingIndex]
  const deletingItemType = getMediaType(deletingItem.url)

  if (deletingItem.action === CONCEPT_STATE.MEDIA_ITEM.ADD) {
    const updatedMedia = state.media.filter(item => item !== deletingItem)
    if (deletingItem.isPrimary) {
      const wasPrimaryItem = updatedMedia.find(item => item.wasPrimary && item.mediaType === deletingItemType)
      if (wasPrimaryItem) {
        wasPrimaryItem.isPrimary = true
        delete wasPrimaryItem.wasPrimary
      }
      return { ...state, media: orderMediaByPrimary(updatedMedia), mediaIndex: 0 }
    }
    return {
      ...state,
      media: updatedMedia,
      mediaIndex: 0,
    }
  }

  // mark as deleted and clear primary flag
  let updatedMedia = state.media.map((item, index) =>
    index === deletingIndex
      ? { ...item, action: CONCEPT_STATE.MEDIA_ITEM.DELETE, isPrimary: false }
      : item
  )

  if (!deletingItem.isPrimary) {
    return { ...state, media: updatedMedia, mediaIndex: deletingIndex }
  }

  // Promote first remaining ADD/EDIT media of this type (but not DELETE)
  const candidateIndex = updatedMedia.findIndex((item, index) => {
    if (item.action === CONCEPT_STATE.MEDIA_ITEM.DELETE) return false
    if (getMediaType(item.url) !== deletingItemType) return false
    return true
  })

  if (candidateIndex !== -1) {
    updatedMedia = updatedMedia.map((item, index) => {
      const itemType = getMediaType(item.url)
      if (itemType !== deletingItemType) return item
      if (index === candidateIndex) return { ...item, isPrimary: true }
      return { ...item, isPrimary: false }
    })
  }

  return { ...state, media: orderMediaByPrimary(updatedMedia) }
}

const editMedia = (state, update) => {
  const mediaIndex = update.mediaIndex
  const editingItem = state.media[mediaIndex]

  const isAdd = editingItem.action === CONCEPT_STATE.MEDIA_ITEM.ADD
  const updatedItem = {
    ...update.mediaItem,
    action: isAdd ? CONCEPT_STATE.MEDIA_ITEM.ADD : CONCEPT_STATE.MEDIA_ITEM.EDIT,
  }

  const mediaType = getMediaType(updatedItem.url)
  const wasPrimary = !!editingItem.isPrimary
  const isPrimaryNow = !!updatedItem.isPrimary

  let updatedMedia = state.media.map((item, index) => (index === mediaIndex ? updatedItem : item))

  if (!mediaType) {
    return { ...state, media: orderMediaByPrimary(updatedMedia) }
  }

  // Case 1: selecting primary true -> demote all other staged items of same type
  if (isPrimaryNow) {
    updatedMedia = updatedMedia.map((item, index) => {
      if (index === mediaIndex) return item

      const itemType = getMediaType(item.url)
      const isSameType = itemType === mediaType
      if (!isSameType) return item

      // Demote any other staged media of this type (ADD or EDIT), regardless of prior state
      return { ...item, isPrimary: false }
    })

    return { ...state, media: orderMediaByPrimary(updatedMedia) }
  }

  // Case 2: deselecting primary on an ADD/EDIT that WAS primary
  // Strategy:
  // - If there is an untouched concept.media primary of this type (NO_ACTION, isPrimary true),
  //   leave it alone and do NOT implicitly override it.
  // - Otherwise, promote the first staged media (ADD/EDIT, not DELETE) of this type.
  if (wasPrimary && !isPrimaryNow) {
    const hasUntouchedConceptPrimary = updatedMedia.some((item, index) => {
      if (index === mediaIndex) return false
      const itemType = getMediaType(item.url)
      if (itemType !== mediaType) return false
      return item.action === CONCEPT_STATE.NO_ACTION && item.isPrimary
    })

    if (hasUntouchedConceptPrimary) {
      return { ...state, media: updatedMedia }
    }

    const candidateIndex = updatedMedia.findIndex((item, index) => {
      if (index === mediaIndex) return false
      const itemType = getMediaType(item.url)
      if (itemType !== mediaType) return false
      if (item.action === CONCEPT_STATE.MEDIA_ITEM.DELETE) return false
      // Only consider staged ADD/EDIT, not NO_ACTION
      if (item.action === CONCEPT_STATE.NO_ACTION) return false
      return true
    })

    if (candidateIndex !== -1) {
      updatedMedia = updatedMedia.map((item, index) => {
        const itemType = getMediaType(item.url)
        if (itemType !== mediaType) return item
        if (index === candidateIndex) return { ...item, isPrimary: true }
        return { ...item, isPrimary: false }
      })
    }
  }

  return { ...state, media: updatedMedia }
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

  const orderedMedia = orderMediaByPrimary(media)

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

// The staged concept.media array will change order when the primary media is changed, so align initial media array
// to the staged array so indexes remain consistent for comparison.
const alignInitialMediaToStaged = (initial, staged) => {
  const initialByKey = initial.reduce((acc, item) => {
    const key = mediaItemKey(item)
    acc[key] = acc[key] ? [...acc[key], item] : [item]
    return acc
  }, {})

  return staged.map(item => {
    const key = mediaItemKey(item)
    const matches = initialByKey[key]
    return matches && matches.length ? matches.shift() : undefined
  })
}

const stagedMediaEdits = stagedEdit => {
  const [_field, media] = stagedEdit
  const alignedInitial = alignInitialMediaToStaged(media.initial, media.staged)

  return stagedEdits({
    displayFields: MEDIA.DISPLAY,
    initial: alignedInitial,
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

