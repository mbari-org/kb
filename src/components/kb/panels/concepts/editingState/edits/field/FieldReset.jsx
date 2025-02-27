import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept_state'
import EditReset from '../EditReset'

const FieldReset = ({ field }) => {
  const { modifyConcept } = use(ConceptContext)

  const onClick = () => modifyConcept({ type: CONCEPT_STATE.FIELD.RESET, field })

  return <EditReset onClick={onClick} />
}

export default FieldReset
