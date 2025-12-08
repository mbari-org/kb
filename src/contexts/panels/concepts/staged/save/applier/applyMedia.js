import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const applyMedia = (concept, tracker) => {
  const addMedia = media => {
    concept.media = [...concept.media, media]
  }

  const deleteMedia = id => {
    concept.media = concept.media.filter(m => m.id !== id)
  }

  const editMedia = (id, updates) => {
    const index = concept.media.findIndex(m => m.id === id)
    if (index >= 0) {
      const next = { ...concept.media[index], ...updates }
      concept.media = concept.media.toSpliced(index, 1, next)
    }
  }
  switch (tracker.action) {
    case CONCEPT_STATE.MEDIA_ITEM.ADD: {
      const payload = tracker.response?.payload
      payload?.id ? addMedia(payload) : addMedia({ ...tracker.params })
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
}

export default applyMedia
