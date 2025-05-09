import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'
import EditReset from '../EditReset'

const FieldReset = ({ field }) => {
  const { confirmDiscard, modifyConcept } = use(ConceptContext)

  const resetting =
    confirmDiscard?.type === CONCEPT_STATE.RESET.FIELD && confirmDiscard?.update?.field === field

  const onClick = () => modifyConcept({ type: CONCEPT_STATE.RESET.FIELD, update: { field } })

  return <EditReset disabled={confirmDiscard} onClick={onClick} resetting={resetting} />
}

export default FieldReset
