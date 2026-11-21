import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { updateConceptNameById } from '@/lib/api/concept'

const buildNameSubmit = (op, effective) => {
  const name = op.item
  const params = [effective.state.primaryNameId, { newName: name.value }]
  return {
    apiFn: updateConceptNameById,
    params,
    tracker: {
      action: CONCEPT_STATE.NAME,
      field: CONCEPT.FIELD.NAME,
      update: name,
    },
  }
}

export default buildNameSubmit
