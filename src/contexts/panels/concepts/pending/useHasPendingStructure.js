import { use } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { PENDING } from '@/lib/constants'
import { fieldPending, hasPending, pendingChild } from '@/lib/kb/model/history'

import { isPendingName } from '@/lib/kb/state/name'

const useHasPendingStructure = () => {
  const { concept, pending } = use(ConceptContext)

  const pendingStructure = {
    any: false,
    children: false,
    name: false,
    parent: false,
  }

  const pendingConcept = pending(PENDING.DATA.CONCEPT)
  const pendingParent = pending(PENDING.DATA.PARENT)

  if (!pendingConcept || !pendingParent) return pendingStructure

  const pendingNames = fieldPending(pendingConcept, 'ConceptName')
  const hasPendingName = pendingNames.some(isPendingName)

  return {
    any: hasPending(pendingConcept),
    children: pendingChild(pendingParent, concept.name),
    name: hasPendingName,
    parent: hasPending(pendingParent),
  }
}

export default useHasPendingStructure
