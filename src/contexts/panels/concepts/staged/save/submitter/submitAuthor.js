import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { updateConceptAuthor } from '@/lib/api/concept'

const buildAuthorSubmit = (op, effective) => {
  const author = op.item.value
  const params = [effective.state.name, { author }]
  return {
    apiFn: updateConceptAuthor,
    params,
    tracker: {
      action: CONCEPT_STATE.AUTHOR,
      field: CONCEPT.FIELD.AUTHOR,
      update: { author },
    },
  }
}

export default buildAuthorSubmit
