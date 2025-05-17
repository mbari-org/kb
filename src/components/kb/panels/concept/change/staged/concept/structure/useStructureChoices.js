import { use, useMemo } from 'react'

import { hasStateChange } from '@/contexts/concept/staged/edit/stateUpdates'
import { hasPendingHistory } from '@/lib/kb/model/history'

import ConceptContext from '@/contexts/concept/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const useStructureChoices = () => {
  const { concept, initialState, stagedState, pendingHistory } = use(ConceptContext)
  const { isRoot: isTaxonomyRoot } = use(TaxonomyContext)

  const isRoot = isTaxonomyRoot(concept)
  const hasPendingName = hasPendingHistory(pendingHistory, 'ConceptName')

  const hasStagedChildren = stagedState.children.length > 0
  const hasStagedName = !!stagedState.nameChange
  const hasStagedParent = stagedState.parent !== concept.parent
  const hasStagedStructure = hasStagedChildren || hasStagedName || hasStagedParent

  const hasChildren = concept.children.length > 0

  const disableDelete = useMemo(
    () => isRoot || hasChildren || hasStagedChildren || hasStateChange(initialState, stagedState),
    [hasChildren, hasStagedChildren, initialState, isRoot, stagedState]
  )
  const disableChangeName = isRoot || hasPendingName || hasStagedStructure
  const disableChangeParent = isRoot || hasStagedStructure

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
