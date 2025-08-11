import { CONCEPT_STATE } from '@/lib/constants'

const applyRealizations = (concept, tracker) => {
  if (!Array.isArray(concept.realizations)) concept.realizations = []
  const add = item => {
    concept.realizations = [...concept.realizations, item]
  }
  const edit = (id, updates) => {
    const idx = concept.realizations.findIndex(m => m.id === id)
    if (idx >= 0) {
      const next = { ...concept.realizations[idx], ...updates }
      concept.realizations = concept.realizations.toSpliced(idx, 1, next)
    }
  }
  const remove = id => {
    concept.realizations = concept.realizations.filter(m => m.id !== id)
  }

  switch (tracker.action) {
    case CONCEPT_STATE.REALIZATION.ADD: {
      const payload = tracker.response?.payload
      if (payload?.id) {
        add(payload)
      } else {
        add({ ...tracker.params })
      }
      break
    }
    case CONCEPT_STATE.REALIZATION.EDIT: {
      const [id, updates] = tracker.params
      edit(id, updates)
      break
    }
    case CONCEPT_STATE.REALIZATION.DELETE: {
      remove(tracker.params)
      break
    }
    default:
      break
  }
}

export default applyRealizations
