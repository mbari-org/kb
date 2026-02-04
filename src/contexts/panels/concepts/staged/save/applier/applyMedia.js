import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { getItemMediaType, typeMediaItem } from '@/lib/model/media'

// Ensure per-type invariant that updatedItem is the one and only one primary item of its type
const ensurePrimaryInvariant = (media, updatedItem) => {
  if (!updatedItem?.isPrimary) return

  const mediaType = getItemMediaType(updatedItem)
  if (!mediaType) return

  media.forEach((item, index) => {
    if (!item.isPrimary || item.url === updatedItem.url || getItemMediaType(item) !== mediaType) return

    media[index].isPrimary = false
  })
}

const applyMedia = (concept, tracker) => {
  const addMedia = mediaItem => {
    const addedMediaItem = typeMediaItem(mediaItem)
    ensurePrimaryInvariant(concept.media, addedMediaItem)
    concept.media.push(addedMediaItem)
  }

  const deleteMedia = url => {
    const index = concept.media.findIndex(m => m.url === url)
    if (index >= 0) {
      concept.media.splice(index, 1)
    }
  }

  const editMedia = (url, itemUpdates) => {
    const index = concept.media.findIndex(m => m.url === url)
    if (index >= 0) {
      const current = concept.media[index]
      const updatedItem = typeMediaItem({ ...current, ...itemUpdates })

      concept.media[index] = updatedItem
      ensurePrimaryInvariant(concept.media, updatedItem)
    }
  }

  switch (tracker.action) {
    case CONCEPT_STATE.MEDIA_ITEM.ADD: {
      const mediaToAdd = tracker.response

      if (!mediaToAdd) {
        throw new Error('applyMedia: MEDIA_ITEM.ADD tracker missing API response')
      }

      const alreadyUpdated = concept.media.some(m => m.url === mediaToAdd.url)

      if (!alreadyUpdated) {
        addMedia(mediaToAdd)
      }
      break
    }

    case CONCEPT_STATE.MEDIA_ITEM.DELETE: {
      if (tracker.isAdmin) {
        deleteMedia(tracker.params)
      }
      break
    }

    case CONCEPT_STATE.MEDIA_ITEM.EDIT: {
      const [url, itemUpdates] = tracker.params
      editMedia(url, itemUpdates)
      break
    }

    default:
      break
  }

}

export default applyMedia
