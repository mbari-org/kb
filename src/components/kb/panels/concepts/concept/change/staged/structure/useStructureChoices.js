import { use, useMemo } from 'react'

import { isStateModified } from '@/lib/concept/state/state'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { hasPendingStructure } from '@/lib/model/history'

import { ACTION } from '@/lib/constants'

const hasStagedStructure = (concept, stagedState) => {
  const hasStagedChildren = stagedState.children.some(child => child.action !== ACTION.NONE)
  const hasStagedDelete = stagedState.delete
  const hasStagedName = stagedState.name.action !== ACTION.NONE
  const hasStagedParent = stagedState.parent.action !== ACTION.NONE

  return {
    hasStagedChildren,
    hasStagedDelete,
    hasStagedName,
    hasStagedParent,
  }
}

const useStructureChoices = () => {
  const { concept, initialState, pending, stagedState } = use(ConceptContext)
  const { isRoot: isTaxonomyRoot } = use(TaxonomyContext)

  const pendingStructure = hasPendingStructure(pending, concept?.name)

  const { hasStagedChildren, hasStagedDelete, hasStagedName, hasStagedParent } = hasStagedStructure(
    concept,
    stagedState
  )

  const isRoot = isTaxonomyRoot(concept)

  const hasChildren = concept?.children?.length > 0

  const disableDelete = useMemo(
    () =>
      isRoot ||
      hasChildren ||
      hasStagedChildren ||
      hasStagedDelete ||
      isStateModified({ initialState, stagedState }) ||
      pendingStructure.any,
    [hasChildren, hasStagedChildren, hasStagedDelete, initialState, isRoot, pendingStructure.any, stagedState]
  )
  const disableChangeName =
    isRoot || pendingStructure.name || hasStagedDelete || hasStagedName || hasStagedChildren
  const disableChangeParent =
    isRoot || pendingStructure.parent || hasStagedDelete || hasStagedParent || hasStagedChildren

  return {
    hasStagedChildren,
    hasStagedDelete,
    hasStagedName,
    hasStagedParent,
    disableDelete,
    disableChangeName,
    disableChangeParent,
  }
}

export default useStructureChoices
