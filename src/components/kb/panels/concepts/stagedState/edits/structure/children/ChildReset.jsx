import { use } from 'react'

import EditReset from '@/components/kb/panels/concepts/stagedState/edits/EditReset'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const { RESET } = CONCEPT_STATE

const ChildReset = ({ child }) => {
  const { stagedState, modifyConcept } = use(ConceptContext)

  const onClick = () => {
    // If last child, do RESET.ADD_CHILDREN
    stagedState.children.length === 1
      ? modifyConcept({ type: RESET.ADD_CHILDREN })
      : modifyConcept({
          type: RESET.ADD_CHILD,
          update: { child },
        })
  }

  return <EditReset onClick={onClick} />
}

export default ChildReset
