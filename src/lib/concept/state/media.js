import { puid } from 'puid-js'

import { getItemMediaType, getMediaType, isPrimary } from '@/lib/model/media'

import { stagedEdits } from '@/lib/concept/state/staged'

import { ACTION, MEDIA } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

import { isEqualWithout } from '@/lib/utils'

const { generator, error: generatorError } = puid({ total: 10, risk: 1e15 })
if (generatorError) throw generatorError

const genStateId = () => generator()

const ensureAction = item => (item.action ? item : { ...item, action: CONCEPT_STATE.NO_ACTION })

const orderMediaByPrimary = media => {
  const itemsWithAction = media.map(ensureAction)
  const primaries = MEDIA.ORDER
    .map(type => itemsWithAction.find(item => getItemMediaType(item) === type && isPrimary(item)) || null)
    .filter(Boolean)

  return [...primaries, ...itemsWithAction.filter(item => !isPrimary(item))]
}

const indexAndType = ({ editingItem, media, updatedItem }) => {
  const editingItemType = getMediaType(editingItem.url)
  const updatedIndex = media.findIndex(item => item === updatedItem)
  return { editingItemType, updatedIndex }
}

const promotePrimary = ({ editingItem, media, updatedItem }) => {
  const { editingItemType, updatedIndex } = indexAndType({ editingItem, media, updatedItem })
  const candidateIndex = media.findIndex((item, index) => {
    if (index === updatedIndex) return false
    const itemType = getMediaType(item.url)
    if (itemType !== editingItemType) return false
    if (item.action === CONCEPT_STATE.MEDIA_ITEM.DELETE) return false
    if (item.action === CONCEPT_STATE.NO_ACTION) return false
    return true
  })

  if (candidateIndex === -1) return media

  return media.map((item, index) => {
    const itemType = getMediaType(item.url)
    if (itemType !== editingItemType) return item
    if (index === candidateIndex) return { ...item, isPrimary: true }
    return { ...item, isPrimary: false }
  })
}

const demotePrimary = ({ editingItem, media, updatedItem }) => {
  const { editingItemType, updatedIndex } = indexAndType({ editingItem, media, updatedItem })

  // Find if an item needs to be demoted (at most one per type of editingItemType)
  const demotedIndex = media.findIndex((item, index) => {
    if (index === updatedIndex) return false
    const itemType = getMediaType(item.url)
    if (itemType !== editingItemType) return false
    return item.isPrimary
  })

  // If no item to demote, just return media unchanged
  if (demotedIndex === -1) return media

  // Demote the found item
  const result = media.map((item, index) => {
    if (index === demotedIndex) return { ...item, isPrimary: false }
    return item
  })

  // Handle edge case: if demoted item doesn't have any changes, restore action to NO_ACTION
  const demotedItem = result[demotedIndex]
  if (demotedItem.action === CONCEPT_STATE.MEDIA_ITEM.EDIT) {
    if (isEqualWithout(demotedItem, editingItem, ['action'])) {
      demotedItem.action = CONCEPT_STATE.NO_ACTION
    }
  }

  return result
}

const addMedia = (state, update) => {
  const addingItem = {
    ...update.mediaItem,
    action: CONCEPT_STATE.MEDIA_ITEM.ADD,
  }

  if (addingItem.isPrimary) {
    const updatedMedia = orderMediaByPrimary([...state.media, addingItem])
    updatedMedia.forEach(item => {
      if (item !== addingItem && item.isPrimary && getMediaType(item.url) === getMediaType(addingItem.url)) {
        item.isPrimary = false
        item.wasPrimary = true
      }
    })
    return {
      ...state,
      media: updatedMedia,
      mediaIndex: updatedMedia.findIndex(item => item === addingItem),
    }
  }

  const updatedMedia = [...state.media, addingItem]
  return {
    ...state,
    media: updatedMedia,
    mediaIndex: updatedMedia.length - 1,
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

  const updatedMedia = state.media.map((item, index) =>
    index === deletingIndex
      ? { ...item, action: CONCEPT_STATE.MEDIA_ITEM.DELETE, isPrimary: false }
      : item
  )

  if (!deletingItem.isPrimary) {
    return { ...state, media: updatedMedia, mediaIndex: deletingIndex }
  }

  // Promote first remaining ADD/EDIT media of this type
  for (const item of updatedMedia) {
    if (item === deletingItem) continue
    if (item.action === CONCEPT_STATE.MEDIA_ITEM.DELETE) continue
    if (getMediaType(item.url) === deletingItemType) {
      item.isPrimary = true
      break
    }
  }
  return { ...state, media: updatedMedia, mediaIndex: deletingIndex }
}

const editMedia = (state, update) => {
  const editingIndex = update.mediaIndex
  const editingItem = state.media[editingIndex]
  const itemUpdates = update.mediaItem

  const updatedItem = { ...editingItem, ...itemUpdates }
  if (updatedItem.action === CONCEPT_STATE.NO_ACTION) updatedItem.action = CONCEPT_STATE.MEDIA_ITEM.EDIT

  // Not changing primary so just update the item
  if (itemUpdates.isPrimary === editingItem.isPrimary) {
    return { ...state, media: state.media.map(item => item === editingItem ? updatedItem : item) }
  }

  const editingItemType = getMediaType(editingItem.url)
  const updatedItemType = getMediaType(updatedItem.url)

  // Not changing type (but changing primary)
  if (editingItemType === updatedItemType) {
    const fnArgs = {
      editingItem,
      media: state.media.map((item, index) => (index === editingIndex ? updatedItem : item)),
      updatedItem,
    }

    const updatedMedia = editingItem.isPrimary ? promotePrimary(fnArgs) : demotePrimary(fnArgs)

    return { ...state, media: orderMediaByPrimary(updatedMedia) }
  }

  // DO NOT PROCEED BELOW HERE

  const wasPrimary = editingItem.isPrimary

  let updatedMedia = state.media.map((item, index) => (index === editingIndex ? itemUpdates : item))

  if (!editingItemType) {
    return { ...state, media: orderMediaByPrimary(updatedMedia) }
  }

  // Case 1: selecting primary true -> demote all other staged items of same type
  if (!wasPrimary) {
    updatedMedia = updatedMedia.map((item, index) => {
      if (index === editingIndex) return item

      const itemType = getMediaType(item.url)
      const isSameType = itemType === editingItemType
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
  if (wasPrimary) {
    const hasUntouchedConceptPrimary = updatedMedia.some((item, index) => {
      if (index === editingIndex) return false
      const itemType = getMediaType(item.url)
      if (itemType !== editingItemType) return false
      return item.action === CONCEPT_STATE.NO_ACTION && item.isPrimary
    })

    if (hasUntouchedConceptPrimary) {
      return { ...state, media: updatedMedia }
    }

    const candidateIndex = updatedMedia.findIndex((item, index) => {
      if (index === editingIndex) return false
      const itemType = getMediaType(item.url)
      if (itemType !== editingItemType) return false
      if (item.action === CONCEPT_STATE.MEDIA_ITEM.DELETE) return false
      // Only consider staged ADD/EDIT, not NO_ACTION
      if (item.action === CONCEPT_STATE.NO_ACTION) return false
      return true
    })

    if (candidateIndex !== -1) {
      updatedMedia = updatedMedia.map((item, index) => {
        const itemType = getMediaType(item.url)
        if (itemType !== editingItemType) return item
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

  const stagedMedia = orderedMedia.map(mediaItem =>
    mediaItemState({ ...mediaItem, stateId: genStateId() }, pendingMedia)
  )

  return { media: stagedMedia }
}

const resetMedia = (state, update) => {
  const { stateId: resetStateId, media: resetMediaArray } = update

  if (1 < state.media.length && resetStateId !== undefined) {
    const resetItem = resetMediaArray.find(item => item.stateId === resetStateId)
    if (resetItem) {
      return {
        ...state,
        media: state.media.map(item => (item.stateId === resetStateId ? resetItem : item)),
      }
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
    displayFields: MEDIA.DISPLAY,
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

