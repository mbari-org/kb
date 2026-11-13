import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { updateConceptParent } from '@/lib/api/concept'

const buildParentSubmit = (op, effective) => {
  const parent = op.item.value
  const params = [effective.state.name, { parentName: parent }]
  return {
    apiFn: updateConceptParent,
    params,
    tracker: {
      action: CONCEPT_STATE.PARENT,
      field: CONCEPT.FIELD.PARENT,
      update: { parentName: parent },
    },
  }
}

export default buildParentSubmit
