import { use, useMemo } from 'react'

import { hasStateChange } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import { hasPending } from '@/lib/kb/model/history'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { PENDING } from '@/lib/constants'

const useStructureChoices = () => {
  const { concept, initialState, pending, stagedState } = use(ConceptContext)
  const { isRoot: isTaxonomyRoot } = use(TaxonomyContext)

  const pendingConcept = pending(PENDING.DATA.CONCEPT)

  const isRoot = isTaxonomyRoot(concept)

  const hasPendingName = hasPending(pendingConcept, 'ConceptName')
  const hasPendingParent = hasPending(pendingConcept, 'ConceptParent')

  const hasStagedChildren = false
  const hasStagedName = stagedState.name.value !== concept.name
  const hasStagedParent = stagedState.parent !== concept.parent
  const hasStagedChange = hasStagedChildren || hasStagedName || hasStagedParent

  const hasChildren = concept.children.length > 0

  const disableDelete = useMemo(
    () =>
      isRoot ||
      hasChildren ||
      hasStateChange(initialState, stagedState) ||
      hasPending(pendingConcept),
    [pendingConcept, hasChildren, initialState, isRoot, stagedState]
  )
  const disableChangeName = isRoot || hasPendingName || hasStagedChange
  const disableChangeParent = isRoot || hasPendingParent || hasStagedChange

  return {
    hasStagedChildren,
    hasStagedName,
    hasStagedParent,
    disableDelete,
    disableChangeName,
    disableChangeParent,
  }
}

export default useStructureChoices
