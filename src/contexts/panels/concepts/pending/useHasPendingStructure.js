import { use } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { PENDING } from '@/lib/constants'
import { hasPending, pendingChild } from '@/lib/kb/model/history'

const useHasPendingStructure = () => {
  const { concept, pending } = use(ConceptContext)

  const pendingConcept = pending(PENDING.DATA.CONCEPT)
  const pendingParent = pending(PENDING.DATA.PARENT)

  return (
    ['Parent', 'Concept.child', 'Concept.parent'].some(field =>
      hasPending(pendingConcept, field)
    ) ||
    pendingChild(pendingParent, concept.name) ||
    pendingConcept.some(
      change => change.field === 'ConceptName' && change.newValue === change.concept
    )
  )
}

export default useHasPendingStructure
