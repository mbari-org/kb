import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'
import EditReset from '../EditReset'

const FieldReset = ({ field }) => {
  const { confirmAction, modifyConcept } = use(ConceptContext)

  const resetting =
    confirmAction?.type === CONCEPT_STATE.RESET.FIELD && confirmAction?.update?.field === field

  const onClick = () => modifyConcept({ type: CONCEPT_STATE.RESET.FIELD, update: { field } })

  return <EditReset disabled={confirmAction} onClick={onClick} resetting={resetting} />
}

export default FieldReset
