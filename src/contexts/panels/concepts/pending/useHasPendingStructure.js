import { use } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import useConceptPending from '@/contexts/panels/concepts/pending/useConceptPending'

import { hasPending, pendingChild } from '@/lib/kb/model/history'

const useHasPendingStructure = () => {
  const { concept } = use(ConceptContext)

  const conceptPending = useConceptPending(concept.name)
  const parentPending = useConceptPending(concept?.parent)

  if (
    ['Parent', 'Concept.child', 'Concept.parent'].some(field => hasPending(conceptPending, field))
  ) {
    return true
  }

  if (pendingChild(parentPending, concept.name)) {
    return true
  }

  if (
    conceptPending.some(
      change => change.field === 'ConceptName' && change.newValue === change.concept
    )
  ) {
    return true
  }

  return false
}

export default useHasPendingStructure
