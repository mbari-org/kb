import { createRealization, deleteRealization, updateRealization } from '@/lib/api/realizations'

import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

import { diff, drop, pick } from '@/lib/utils'

const { REALIZATION } = CONCEPT_STATE

const buildRealizationSubmit = (op, effective) => {
  const { action, index, item } = op

  switch (action) {
    case REALIZATION.ADD: {
      const realization = pick(item, ['linkName', 'toConcept', 'linkValue'])
      const params = {
        ...realization,
        concept: effective.state.name,
      }
      return {
        apiFn: createRealization,
        params,
        tracker: { action, field: CONCEPT.FIELD.REALIZATIONS, index, update: item },
      }
    }

    case REALIZATION.EDIT: {
      const prior = effective.findRealization(item)
      const updateDiff = diff(item, prior)
      const realization = drop(updateDiff, ['action', 'stagedSeq', 'stateId'])
      const params = [prior.id, realization]
      return {
        apiFn: updateRealization,
        params,
        tracker: { action, field: CONCEPT.FIELD.REALIZATIONS, index, update: item },
      }
    }

    case REALIZATION.DELETE: {
      const prior = effective.findRealization(item)
      const params = prior.id
      return {
        apiFn: deleteRealization,
        params,
        tracker: { action, field: CONCEPT.FIELD.REALIZATIONS, index, update: item },
      }
    }

    default:
      throw new Error(`Unknown realization action: ${action}`)
  }
}

export default buildRealizationSubmit
