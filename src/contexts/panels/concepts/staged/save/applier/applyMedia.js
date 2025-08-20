import { CONCEPT_STATE } from '@/lib/constants'

const applyMedia = (concept, tracker) => {
  const add = item => {
    concept.media = [...concept.media, item]
  }
  const edit = (id, updates) => {
    const idx = concept.media.findIndex(m => m.id === id)
    if (idx >= 0) {
      const next = { ...concept.media[idx], ...updates }
      concept.media = concept.media.toSpliced(idx, 1, next)
    }
  }
  const remove = id => {
    concept.media = concept.media.filter(m => m.id !== id)
  }

  switch (tracker.action) {
    case CONCEPT_STATE.MEDIA_ITEM.ADD: {
      const payload = tracker.response?.payload
      if (payload?.id) {
        add(payload)
      } else {
        add({ ...tracker.params })
      }
      break
    }
    case CONCEPT_STATE.MEDIA_ITEM.EDIT: {
      const [id, updates] = tracker.params
      edit(id, updates)
      break
    }
    case CONCEPT_STATE.MEDIA_ITEM.DELETE: {
      remove(tracker.params)
      break
    }
    default:
      break
  }
}

export default applyMedia
