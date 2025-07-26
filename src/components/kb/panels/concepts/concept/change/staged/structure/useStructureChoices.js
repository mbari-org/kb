import { use, useMemo } from 'react'

import { hasStateChange } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import { hasPending } from '@/lib/kb/model/history'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useConceptPending from '@/contexts/panels/concepts/pending/useConceptPending'

const useStructureChoices = () => {
  const { concept, initialState, stagedState } = use(ConceptContext)
  const { isRoot: isTaxonomyRoot } = use(TaxonomyContext)

  const conceptPending = useConceptPending(concept.name)

  const isRoot = isTaxonomyRoot(concept)

  const hasPendingName = hasPending(conceptPending, 'ConceptName')
  const hasPendingParent = hasPending(conceptPending, 'ConceptParent')

  const hasStagedChildren = stagedState.children.length > 0
  const hasStagedName = stagedState.name.value !== concept.name
  const hasStagedParent = stagedState.parent !== concept.parent
  const hasStagedChange = hasStagedChildren || hasStagedName || hasStagedParent

  const hasChildren = concept.children.length > 0

  const disableDelete = useMemo(
    () =>
      isRoot ||
      hasChildren ||
      hasStateChange(initialState, stagedState) ||
      hasPending(conceptPending),
    [conceptPending, hasChildren, initialState, isRoot, stagedState]
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
