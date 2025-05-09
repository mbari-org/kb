import { use } from 'react'

import EditReset from '@/components/kb/panels/concepts/stagedState/edits/EditReset'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'

const { RESET } = CONCEPT_STATE

const ChildrenReset = () => {
  const { confirmDiscard, modifyConcept } = use(ConceptContext)

  const resetting =
    confirmDiscard?.type === RESET.ADD_CHILDREN || confirmDiscard?.type === RESET.TO_INITIAL

  const onClick = () => {
    modifyConcept({ type: RESET.ADD_CHILDREN })
  }

  return <EditReset disabled={confirmDiscard} onClick={onClick} resetting={resetting} />
}

export default ChildrenReset
