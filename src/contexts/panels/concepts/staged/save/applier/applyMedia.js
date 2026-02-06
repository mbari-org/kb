import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { getItemMediaType, typeMediaItem } from '@/lib/model/media'

// Ensure per-type invariant that updatedItem is the one and only one primary item of its type.
const ensurePrimaryInvariant = (media, updatedItem) => {
  if (!updatedItem?.isPrimary) return

  const mediaType = getItemMediaType(updatedItem)
  if (!mediaType) return

  const updatedId = updatedItem.id

  media.forEach((item, index) => {
    if (!item.isPrimary) return
    if (updatedId != null && item.id === updatedId) return
    if (getItemMediaType(item) !== mediaType) return

    media[index] = { ...item, isPrimary: false }
  })
}

const mediaIndex = (concept, id) => concept.media.findIndex(m => m.id === id)

const addMedia = (concept, tracker) => {
  const mediaItem = tracker.response

  if (!mediaItem) {
    throw new Error('applyMedia: MEDIA_ITEM.ADD tracker missing API response')
  }

  const existingIndex = mediaItem.id
    ? concept.media.findIndex(m => m.id === mediaItem.id)
    : concept.media.findIndex(m => m.url === mediaItem.url)

  const addedMediaItem = typeMediaItem(mediaItem)

  if (existingIndex !== -1) {
    const current = concept.media[existingIndex]
    const updatedItem = typeMediaItem({ ...current, ...mediaItem })
    concept.media[existingIndex] = updatedItem
    ensurePrimaryInvariant(concept.media, updatedItem)
    console.log('addMedia', concept.media)
    return
  }

  ensurePrimaryInvariant(concept.media, addedMediaItem)
  concept.media.push(addedMediaItem)
  console.log('addMedia', concept.media)

}

const deleteMedia = (concept, tracker) => {
  if (!tracker.isAdmin) return

  const index = mediaIndex(concept, tracker.params)
  if (index !== -1) {
    concept.media.splice(index, 1)
  }
  console.log('deleteMedia', concept.media)
}

const editMedia = (concept, tracker) => {
  const [id, itemUpdates] = tracker.params
  const index = mediaIndex(concept, id)
  if (index !== -1) {
    const current = concept.media[index]
    const updatedItem = typeMediaItem({ ...current, ...itemUpdates })

    concept.media[index] = updatedItem
    ensurePrimaryInvariant(concept.media, updatedItem)
  }
  console.log('editMedia', concept.media)
}

const applyMedia = (concept, tracker) => {
  switch (tracker.action) {
    case CONCEPT_STATE.MEDIA_ITEM.ADD: {
      addMedia(concept, tracker)
      break
    }

    case CONCEPT_STATE.MEDIA_ITEM.DELETE: {
      deleteMedia(concept, tracker)
      break
    }

    case CONCEPT_STATE.MEDIA_ITEM.EDIT: {
      editMedia(concept, tracker)
      break
    }

    default:
      break
  }
}

export default applyMedia
