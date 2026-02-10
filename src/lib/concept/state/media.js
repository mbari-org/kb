import { puid } from 'puid-js'

import { getItemMediaType, getMediaType, isPrimary } from '@/lib/model/media'

import { stagedEdits } from '@/lib/concept/state/staged'

import { ACTION, MEDIA } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

import { isEqualWithout, isJsonEqual } from '@/lib/utils'

const { generator, error: generatorError } = puid({ total: 10, risk: 1e15 })
if (generatorError) throw generatorError

const genStateId = () => generator()

const isModified = (initial, staged) => !isJsonEqual(initial?.media, staged?.media)

const ensureAction = item => (item.action ? item : { ...item, action: CONCEPT_STATE.NO_ACTION })

const orderByPrimary = media => {
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

const demotePrimary = ({ editingItem, media, updatedItem, initialMedia }) => {
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
  if (demotedItem.action === CONCEPT_STATE.MEDIA_ITEM.EDIT && initialMedia) {
    const initialDemotedItem = initialMedia.find(item => item.stateId === demotedItem.stateId)
    if (initialDemotedItem && isEqualWithout(demotedItem, initialDemotedItem, ['action', 'isPrimary'])) {
      demotedItem.action = CONCEPT_STATE.NO_ACTION
    }
  }

  return result
}

const addMedia = ({ stagedState, update }) => {
  const addingItem = {
    ...update.mediaItem,
    action: CONCEPT_STATE.MEDIA_ITEM.ADD,
  }

  if (addingItem.isPrimary) {
    const updatedMedia = orderByPrimary([...stagedState.media, addingItem])
    updatedMedia.forEach(item => {
      if (item !== addingItem && item.isPrimary && getMediaType(item.url) === getMediaType(addingItem.url)) {
        item.isPrimary = false
        item.wasPrimary = true
      }
    })
    return {
      ...stagedState,
      media: updatedMedia,
      mediaIndex: updatedMedia.findIndex(item => item === addingItem),
    }
  }

  const updatedMedia = [...stagedState.media, addingItem]
  return {
    ...stagedState,
    media: updatedMedia,
    mediaIndex: updatedMedia.length - 1,
  }

}

const deleteMedia = ({ stagedState, update }) => {
  const deletingIndex = update.mediaIndex
  const deletingItem = stagedState.media[deletingIndex]
  const deletingItemType = getMediaType(deletingItem.url)

  if (deletingItem.action === CONCEPT_STATE.MEDIA_ITEM.ADD) {
    const updatedMedia = stagedState.media.filter(item => item !== deletingItem)
    if (deletingItem.isPrimary) {
      const wasPrimaryItem = updatedMedia.find(item => item.wasPrimary && item.mediaType === deletingItemType)
      if (wasPrimaryItem) {
        wasPrimaryItem.isPrimary = true
        delete wasPrimaryItem.wasPrimary
      }
      return { ...stagedState, media: orderByPrimary(updatedMedia), mediaIndex: 0 }
    }
    return {
      ...stagedState,
      media: updatedMedia,
      mediaIndex: 0,
    }
  }

  const updatedMedia = stagedState.media.map((item, index) =>
    index === deletingIndex
      ? { ...item, action: CONCEPT_STATE.MEDIA_ITEM.DELETE, isPrimary: false }
      : item
  )

  if (!deletingItem.isPrimary) {
    return { ...stagedState, media: updatedMedia, mediaIndex: deletingIndex }
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
  return { ...stagedState, media: updatedMedia, mediaIndex: deletingIndex }
}

const editMedia = ({ initialState, stagedState, update }) => {
  const editingIndex = update.mediaIndex
  const editingItem = stagedState.media[editingIndex]
  const itemUpdates = update.mediaItem

  const updatedItem = { ...editingItem, ...itemUpdates }

  // If URL changed, update mediaType to match the new URL
  if (itemUpdates.url && itemUpdates.url !== editingItem.url) {
    const newMediaType = getMediaType(itemUpdates.url)
    if (newMediaType) {
      updatedItem.mediaType = newMediaType
    }
  }

  // Check if we're restoring to initial state before setting action
  const initialItem = initialState?.media?.find(item => item.stateId === updatedItem.stateId)
  const isRestoringToInitial = initialItem && isEqualWithout(updatedItem, initialItem, ['action'])

  if (updatedItem.action === CONCEPT_STATE.NO_ACTION && !isRestoringToInitial) {
    updatedItem.action = CONCEPT_STATE.MEDIA_ITEM.EDIT
  }

  // Not changing primary so just update the item
  if (itemUpdates.isPrimary === editingItem.isPrimary) {
    const updatedMedia = stagedState.media.map(item => item === editingItem ? updatedItem : item)
    return { ...stagedState, media: updatedMedia, mediaIndex: editingIndex }
  }

  const editingItemType = getMediaType(editingItem.url)
  const updatedItemType = getMediaType(updatedItem.url)

  // Not changing type (but changing primary)
  if (editingItemType === updatedItemType) {
    const fnArgs = {
      editingItem,
      media: stagedState.media.map((item, index) => (index === editingIndex ? updatedItem : item)),
      updatedItem,
      initialMedia: initialState?.media,
    }

    const primaryAdjustedMedia = editingItem.isPrimary ? promotePrimary(fnArgs) : demotePrimary(fnArgs)
    const updatedMedia = orderByPrimary(primaryAdjustedMedia)
    const editedMediaIndex = updatedMedia.findIndex(item => item.stateId === updatedItem.stateId)

    return { ...stagedState, media: updatedMedia, mediaIndex: editedMediaIndex }
  }

  // Changing type: handle old type primary demotion and new type primary handling
  const oldTypeMedia = stagedState.media.map((item, index) => (index === editingIndex ? updatedItem : item))

  // If changing away from primary, need to demote old type's primary if one exists
  let finalMedia = oldTypeMedia
  if (editingItem.isPrimary) {
    const demoteArgs = {
      editingItem,
      media: oldTypeMedia,
      updatedItem,
      initialMedia: initialState?.media,
    }
    finalMedia = demotePrimary(demoteArgs)
  }

  // If setting new type as primary, need to demote other items of new type
  if (updatedItem.isPrimary) {
    finalMedia = finalMedia.map((item, index) => {
      if (index === editingIndex) return item
      const itemType = getMediaType(item.url)
      if (itemType !== updatedItemType) return item
      return { ...item, isPrimary: false }
    })
  }

  const updatedMedia = orderByPrimary(finalMedia)
  const editedMediaIndex = updatedMedia.findIndex(item => item.stateId === updatedItem.stateId)

  return { ...stagedState, media: updatedMedia, mediaIndex: editedMediaIndex }
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

  const orderedMedia = orderByPrimary(media)

  const pendingMedia = pendingConcept.filter(isPendingMedia)

  const stagedMedia = orderedMedia.map(mediaItem =>
    mediaItemState({ ...mediaItem, stateId: genStateId() }, pendingMedia)
  )

  return { media: stagedMedia }
}

const resetMedia = ({ stagedState, update }) => {
  const { stateId: resetStateId, media: resetMediaArray } = update

  if (1 < stagedState.media.length && resetStateId !== undefined) {
    const resetItem = resetMediaArray.find(item => item.stateId === resetStateId)
    if (resetItem) {
      return {
        ...stagedState,
        media: stagedState.media.map(item => (item.stateId === resetStateId ? resetItem : item)),
      }
    }
  }
  return {
    ...stagedState,
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
  isModified,
  isPendingMedia,
  mediaState,
  resetMedia,
  stagedMediaEdits,
}

