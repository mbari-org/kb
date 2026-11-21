import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { updateConceptNameById } from '@/lib/api/concept'

const buildAuthorSubmit = (op, effective) => {
  const author = op.item.value
  const params = [effective.state.primaryNameId, { author }]
  return {
    apiFn: updateConceptNameById,
    params,
    tracker: {
      action: CONCEPT_STATE.AUTHOR,
      field: CONCEPT.FIELD.AUTHOR,
      update: { author },
    },
  }
}

export default buildAuthorSubmit
