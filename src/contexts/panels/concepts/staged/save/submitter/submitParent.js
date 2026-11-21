import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { updateConceptById } from '@/lib/api/concept'

const buildParentSubmit = (op, effective) => {
  const parent = op.item.value
  const params = [effective.state.id, { parentName: parent }]
  return {
    apiFn: updateConceptById,
    params,
    tracker: {
      action: CONCEPT_STATE.PARENT,
      field: CONCEPT.FIELD.PARENT,
      update: { parentName: parent },
    },
  }
}

export default buildParentSubmit
