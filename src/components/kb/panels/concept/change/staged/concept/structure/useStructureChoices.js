import { use, useMemo } from 'react'

import { hasStateChange } from '@/contexts/concept/lib/edit/stateUpdates'
import { hasPendingHistory } from '@/lib/kb/model/history'

import ConceptContext from '@/contexts/concept/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const useStructureChoices = () => {
  const { concept, initialState, stagedState, pendingHistory } = use(ConceptContext)
  const { isRoot: isTaxonomyRoot } = use(TaxonomyContext)

  const isRoot = isTaxonomyRoot(concept)
  const nameHasPendingHistory = hasPendingHistory(pendingHistory, 'ConceptName')

  const conceptHasChildren = concept.children.length > 0 || stagedState.children.length > 0
  const conceptHasNameUpdate = !!stagedState.nameChange
  const conceptHasParentUpdate = stagedState.parent !== concept.parent

  const disableChangeName =
    isRoot || nameHasPendingHistory || conceptHasNameUpdate || conceptHasParentUpdate
  const disableChangeParent = isRoot || conceptHasParentUpdate || conceptHasNameUpdate
  const disableDelete = useMemo(
    () => isRoot || conceptHasChildren || hasStateChange(initialState, stagedState),
    [conceptHasChildren, initialState, isRoot, stagedState]
  )

  return { disableDelete, disableChangeName, disableChangeParent }
}

export default useStructureChoices
