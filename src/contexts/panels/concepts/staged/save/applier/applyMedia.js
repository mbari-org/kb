import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { MEDIA_TYPES, getItemMediaType, isPrimary, typeMediaItem } from '@/lib/model/media'

const ensurePrimaryInvariant = (media, mediaItem) => {
  if (!mediaItem.isPrimary) return null

  const mediaType = getItemMediaType(mediaItem)
  if (!mediaType) return null

  const otherPrimary = media.find(
    item =>
      getItemMediaType(item) === mediaType &&
      item !== mediaItem
  ) || null

  if (!otherPrimary) return null

  return media.map(item =>
    item === otherPrimary ? { ...item, isPrimary: false } : item
  )
}

const applyMedia = (concept, tracker) => {
  const addMedia = mediaItem => {
    const addedMediaItem = typeMediaItem(mediaItem)

    // If the new media is primary, clear primary on other items of the same type
    let baseMedia = concept.media
    const updatedMedia = ensurePrimaryInvariant(baseMedia, addedMediaItem)
    if (updatedMedia) {
      baseMedia = updatedMedia
    }
    concept.media = [...baseMedia, addedMediaItem]
  }

  const deleteMedia = id => {
    concept.media = concept.media.filter(m => m.id !== id)
  }

  const editMedia = (id, itemUpdates) => {
    const index = concept.media.findIndex(m => m.id === id)
    if (index >= 0) {
      const current = concept.media[index]
      const updatedItem = typeMediaItem({ ...current, ...itemUpdates })

      let updatedMedia = concept.media.toSpliced(index, 1, updatedItem)

      // If this edit makes an item primary, clear primary on other items of the same type
      if (itemUpdates?.isPrimary) {
        const type = getItemMediaType(updatedItem)
        if (type) {
          updatedMedia = updatedMedia.map(mediaItem =>
            mediaItem.id !== id && getItemMediaType(mediaItem) === type ? { ...mediaItem, isPrimary: false } : mediaItem
          )
        }
      }

      concept.media = updatedMedia
    }
  }

  switch (tracker.action) {
    case CONCEPT_STATE.MEDIA_ITEM.ADD: {
      const mediaToAdd = tracker.response

      if (!mediaToAdd) {
        throw new Error('applyMedia: MEDIA_ITEM.ADD tracker missing API response')
      }

      const alreadyUpdated = mediaToAdd.id
        ? concept.media.some(m => m.id === mediaToAdd.id)
        : concept.media.some(m => m.url === mediaToAdd.url && m.mediaType === mediaToAdd.mediaType)

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
      const [id, itemUpdates] = tracker.params
      editMedia(id, itemUpdates)
      break
    }
    default:
      break
  }

  // After applying this tracker, ensure media are ordered so primary of each type comes first
  if (concept.media.length > 0) {
    const media = concept.media
    const mediaKey = item => item.id ?? `${item.url}|${getItemMediaType(item) ?? 'UNKNOWN'}`

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

    const nonPrimaries = media.filter(item => !primaryKeys.has(mediaKey(item)))

    concept.media = [...primaries, ...nonPrimaries]
  }
}

export default applyMedia
