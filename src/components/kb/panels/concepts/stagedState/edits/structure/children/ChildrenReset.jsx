import { use } from 'react'

import EditReset from '@/components/kb/panels/concepts/stagedState/edits/EditReset'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'

const { RESET } = CONCEPT_STATE

const ChildrenReset = () => {
  const { modifyConcept } = use(ConceptContext)

  const onClick = () => {
    modifyConcept({ type: RESET.ADD_CHILDREN })
  }

  return <EditReset onClick={onClick} />
}

export default ChildrenReset
