import { use } from 'react'

import EditReset from '@/components/kb/panels/concepts/stagedState/edits/EditReset'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'

const { RESET } = CONCEPT_STATE

const ChildReset = ({ child }) => {
  const { confirmDiscard, modifyConcept, stagedState } = use(ConceptContext)

  const resetting =
    confirmDiscard?.type === RESET.ADD_CHILD ||
    (confirmDiscard?.type === RESET.ADD_CHILDREN && confirmDiscard?.update?.child === child) ||
    confirmDiscard?.type === RESET.TO_INITIAL

  const onClick = () => {
    // If last child, do RESET.ADD_CHILDREN
    stagedState.children.length === 1
      ? modifyConcept({ type: RESET.ADD_CHILDREN })
      : modifyConcept({
          type: RESET.ADD_CHILD,
          update: { child },
        })
  }

  return <EditReset disabled={confirmDiscard} onClick={onClick} resetting={resetting} />
}

export default ChildReset
