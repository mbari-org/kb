import { use } from 'react'

import EditReset from '@/components/kb/panels/concepts/stagedState/edits/EditReset'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'

const { RESET } = CONCEPT_STATE

const ChildrenReset = () => {
  const { confirmAction, modifyConcept } = use(ConceptContext)

  const resetting = confirmAction?.type === RESET.ADD_CHILDREN

  const onClick = () => {
    modifyConcept({ type: RESET.ADD_CHILDREN })
  }

  return <EditReset disabled={confirmAction} onClick={onClick} resetting={resetting} />
}

export default ChildrenReset
