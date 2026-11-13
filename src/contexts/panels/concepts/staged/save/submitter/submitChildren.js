import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { createConcept } from '@/lib/api/concept'

import { drop } from '@/lib/utils'

const { CHILD } = CONCEPT_STATE

const buildChildSubmit = (op, effective) => {
  const { action, index, item } = op
  if (action !== CHILD.ADD) {
    throw new Error(`Unknown child action: ${action}`)
  }

  const params = drop({ ...item, parentName: effective.state.name }, ['action', 'index', 'stagedSeq'])
  return {
    apiFn: createConcept,
    params,
    tracker: { action: CHILD.ADD, field: CONCEPT.FIELD.CHILDREN, index, update: item },
  }
}

export default buildChildSubmit
