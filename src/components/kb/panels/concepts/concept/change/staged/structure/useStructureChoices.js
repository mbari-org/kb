import { use, useMemo } from 'react'

import { isStagedAction } from '@/lib/concept/state/staged'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { hasPendingStructure, pendingChild } from '@/lib/model/history'

import { ACTION } from '@/lib/constants'
import { CONCEPT } from '@/lib/constants/concept.js'
import { PENDING } from '@/lib/constants/pending.js'

import CONFIG from '@/lib/config'

const DISABLED = CONFIG.CONCEPT.STRUCTURE.DISABLED

const hasStagedStructure = stagedState => {
  const hasStagedChildren = stagedState.children.some(child => isStagedAction(child.action))
  const hasStagedDelete = Boolean(stagedState[CONCEPT.FIELD.DELETE])
  const hasStagedName = isStagedAction(stagedState.name.action)
  const hasStagedParent = isStagedAction(stagedState.parent.action)

  return {
    hasStagedChildren,
    hasStagedDelete,
    hasStagedName,
    hasStagedParent,
  }
}

const firstReason = (...candidates) => candidates.find(Boolean) || null

const useStructureChoices = () => {
  const { concept, pending } = use(ConceptContext)
  const { stagedState } = use(ConceptStagedContext)
  const { isRoot: isTaxonomyRoot } = use(TaxonomyContext)

  const pendingStructure = hasPendingStructure(pending, concept?.name)

  const hasPendingAdd =
    pendingChild(pending(PENDING.DATA.PARENT), concept?.name)?.action === ACTION.ADD

  const { hasStagedChildren, hasStagedDelete, hasStagedName, hasStagedParent } = hasStagedStructure(stagedState)

  const isRoot = isTaxonomyRoot(concept)
  const hasChildren = concept?.children?.length > 0

  const disableChangeNameReason = firstReason(
    isRoot && DISABLED.ROOT,
    hasPendingAdd && DISABLED.PENDING_ADD,
    pendingStructure.name && DISABLED.PENDING_NAME,
    hasStagedDelete && DISABLED.STAGED_DELETE,
    hasStagedName && DISABLED.STAGED_NAME
  )

  const disableChangeParentReason = firstReason(
    isRoot && DISABLED.ROOT,
    hasPendingAdd && DISABLED.PENDING_ADD,
    pendingStructure.parent && DISABLED.PENDING_DELETE,
    pendingStructure.parentChange && DISABLED.PENDING_PARENT,
    hasStagedDelete && DISABLED.STAGED_DELETE,
    hasStagedParent && DISABLED.STAGED_PARENT,
    hasStagedChildren && DISABLED.STAGED_CHILDREN
  )

  const disableAddChildReason = firstReason(hasPendingAdd && DISABLED.PENDING_ADD)

  const disableDeleteReason = useMemo(
    () =>
      firstReason(
        isRoot && DISABLED.ROOT,
        hasPendingAdd && DISABLED.PENDING_ADD,
        hasChildren && DISABLED.HAS_CHILDREN,
        hasStagedDelete && DISABLED.STAGED_DELETE,
        pendingStructure.parent && DISABLED.PENDING_DELETE
      ),
    [hasChildren, hasPendingAdd, hasStagedDelete, isRoot, pendingStructure.parent]
  )

  return {
    hasPendingAdd,
    hasStagedChildren,
    hasStagedDelete,
    hasStagedName,
    hasStagedParent,
    disableAddChild: Boolean(disableAddChildReason),
    disableAddChildReason,
    disableChangeName: Boolean(disableChangeNameReason),
    disableChangeNameReason,
    disableChangeParent: Boolean(disableChangeParentReason),
    disableChangeParentReason,
    disableDelete: Boolean(disableDeleteReason),
    disableDeleteReason,
  }
}

export default useStructureChoices
