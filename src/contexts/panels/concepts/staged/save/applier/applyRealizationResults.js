import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

import { REALIZATION_VALUE_FIELDS, sortRealizations } from '@/lib/model/realization'
import { pick } from '@/lib/utils'

const { REALIZATION } = CONCEPT_STATE

const applyRealizationResults = ({ concept, isAdmin, result }) => {
  switch (result.action) {
    case REALIZATION.ADD: {
      const added = result.response?.id
        ? pick(result.response, ['id', ...REALIZATION_VALUE_FIELDS])
        : pick(result.params, REALIZATION_VALUE_FIELDS)
      concept.realizations = sortRealizations([...concept.realizations, added])
      break
    }
    case REALIZATION.EDIT: {
      const [id, updates] = result.params
      concept.realizations = sortRealizations(
        concept.realizations.map(realization =>
          realization.id === id ? { ...realization, ...updates } : realization
        )
      )
      break
    }
    case REALIZATION.DELETE: {
      // A non-admin delete only creates a pending item server-side; keep the realization so the
      // concept display can mark it pending.
      if (isAdmin) {
        concept.realizations = concept.realizations.filter(realization => realization.id !== result.params)
      }
      break
    }
  }
}

export default applyRealizationResults
