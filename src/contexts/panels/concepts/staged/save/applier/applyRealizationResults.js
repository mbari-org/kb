import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { sortRealizations } from '@/lib/model/realization'

const applyRealizationResults = ({ concept, isAdmin, result }) => {

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

  switch (result.action) {
    case CONCEPT_STATE.REALIZATION.ADD:
      // no-op Server response already includes the realization
      break

    case CONCEPT_STATE.REALIZATION.DELETE: {
      if (isAdmin) {
        deleteRealization(result.params)
      }
      break
    }

    case CONCEPT_STATE.REALIZATION.EDIT: {
      const [id, updates] = result.params
      editRealization(id, updates)
      break
    }
    default:
      break
  }
}

export default applyRealizationResults
