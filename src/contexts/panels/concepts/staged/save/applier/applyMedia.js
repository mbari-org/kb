import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { MEDIA_TYPES, getItemMediaType, isPrimary, normalizeMediaItem } from '@/lib/model/media'

const applyMedia = (concept, tracker) => {
  const addMedia = media => {
    const next = normalizeMediaItem(media)

    // If the new media is primary, clear primary on other items of the same type
    let baseMedia = concept.media
    if (next.isPrimary) {
      const type = getItemMediaType(next)
      if (type) {
        baseMedia = baseMedia.map(m =>
          getItemMediaType(m) === type ? { ...m, isPrimary: false } : m
        )
      }
    }

    concept.media = [...baseMedia, next]
  }

  const deleteMedia = id => {
    concept.media = concept.media.filter(m => m.id !== id)
  }

  const editMedia = (id, updates) => {
    const index = concept.media.findIndex(m => m.id === id)
    if (index >= 0) {
      const current = concept.media[index]
      const next = normalizeMediaItem({ ...current, ...updates })

      let updatedMedia = [...concept.media]
      updatedMedia.splice(index, 1, next)

      // If this edit makes an item primary, clear primary on other items of the same type
      if (updates && updates.isPrimary) {
        const type = getItemMediaType(next)
        if (type) {
          updatedMedia = updatedMedia.map(m =>
            m.id !== id && getItemMediaType(m) === type ? { ...m, isPrimary: false } : m
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
      const [id, updates] = tracker.params
      editMedia(id, updates)
      break
    }
    default:
      break
  }

  // After applying this tracker, ensure media are ordered so primaries come first
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
