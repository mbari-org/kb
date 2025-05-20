import { use, useMemo } from 'react'

import { hasStateChange } from '@/contexts/concept/staged/edit/stateUpdates'
import { hasPending } from '@/lib/kb/model/history'

import ConceptContext from '@/contexts/concept/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useConceptPending from '@/contexts/concept/pending/useConceptPending'

const useStructureChoices = () => {
  const { concept, initialState, stagedState } = use(ConceptContext)
  const { isRoot: isTaxonomyRoot } = use(TaxonomyContext)

  const conceptPending = useConceptPending(concept)

  const isRoot = isTaxonomyRoot(concept)
  const hasPendingName = hasPending(conceptPending, 'ConceptName')

  const hasStagedChildren = stagedState.children.length > 0
  const hasStagedName = !!stagedState.nameChange
  const hasStagedParent = stagedState.parent !== concept.parent
  const hasStagedStructure = hasStagedChildren || hasStagedName || hasStagedParent

  const hasChildren = concept.children.length > 0

  const disableDelete = useMemo(
    () => isRoot || hasChildren || hasStagedStructure || hasStateChange(initialState, stagedState),
    [hasChildren, hasStagedStructure, initialState, isRoot, stagedState]
  )
  const disableChangeName = isRoot || hasPendingName || hasStagedStructure
  const disableChangeParent = isRoot || hasStagedName || hasStagedParent

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
