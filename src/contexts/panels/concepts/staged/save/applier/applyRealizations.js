import { CONCEPT_STATE } from '@/lib/constants'
import { sortRealizations } from '@/lib/kb/model/realization'

const applyRealizations = (concept, tracker) => {
  const addRealization = realization => {
    concept.realizations = sortRealizations([...concept.realizations, realization])
  }

  const deleteRealization = id => {
    const updated = concept.realizations.filter(realization => realization.id !== id)
    concept.realizations = sortRealizations(updated)
  }

  const editRealization = (id, updates) => {
    const index = concept.realizations.findIndex(realization => realization.id === id)
    if (index >= 0) {
      const next = { ...concept.realizations[index], ...updates }
      const updated = concept.realizations.toSpliced(index, 1, next)
      concept.realizations = sortRealizations(updated)
    }
  }

  switch (tracker.action) {
    case CONCEPT_STATE.REALIZATION.ADD: {
      const payload = tracker.response?.payload
      payload?.id ? addRealization(payload) : addRealization({ ...tracker.params })
      break
    }

    case CONCEPT_STATE.REALIZATION.DELETE: {
      if (tracker.isAdmin) {
        deleteRealization(tracker.params)
      }
      break
    }

    case CONCEPT_STATE.REALIZATION.EDIT: {
      const [id, updates] = tracker.params
      editRealization(id, updates)
      break
    }
    default:
      break
  }
}

export default applyRealizations
