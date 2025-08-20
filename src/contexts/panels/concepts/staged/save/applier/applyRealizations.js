import { CONCEPT_STATE } from '@/lib/constants'
import { sortRealizations } from '@/lib/kb/model/realizations'

const applyRealizations = (concept, tracker) => {
  const add = item => {
    concept.realizations = sortRealizations([...concept.realizations, item])
  }
  const edit = (id, updates) => {
    const idx = concept.realizations.findIndex(m => m.id === id)
    if (idx >= 0) {
      const next = { ...concept.realizations[idx], ...updates }
      const updated = concept.realizations.toSpliced(idx, 1, next)
      concept.realizations = sortRealizations(updated)
    }
  }
  const remove = id => {
    const updated = concept.realizations.filter(m => m.id !== id)
    concept.realizations = sortRealizations(updated)
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
