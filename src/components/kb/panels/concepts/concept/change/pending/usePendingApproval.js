import { use, useMemo } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { fieldPending } from '@/lib/kb/model/history'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL

const getFieldNameForGroup = group => {
  switch (group) {
    case PENDING.GROUP.ALIASES:
      return 'ConceptName'

    case PENDING.GROUP.CHILDREN:
      return 'Concept.child'

    case PENDING.GROUP.CONCEPT_NAME:
      return 'ConceptName'

    case PENDING.GROUP.MEDIA:
      return 'Media'

    case PENDING.GROUP.RANK:
      return ['RankLevel', 'RankName']

    case PENDING.GROUP.REALIZATIONS:
      return 'LinkRealization'

    case 'Concept.parent':
      return 'Concept.parent'

    default:
      return null
  }
}

const isTargetInGroup = (target, group, pendingConcept, conceptName) => {
  const fieldName = getFieldNameForGroup(group)
  if (!fieldName) {
    return false
  }

  // Special handling for ALIASES and CONCEPT_NAME groups since they share the same field
  if (group === PENDING.GROUP.ALIASES || group === PENDING.GROUP.CONCEPT_NAME) {
    const fieldItems = fieldPending(pendingConcept, fieldName)

    if (group === PENDING.GROUP.ALIASES) {
      // For aliases, exclude the concept name itself
      return fieldItems.some(
        history => history.id === target.id && history.newValue !== conceptName
      )
    } else if (group === PENDING.GROUP.CONCEPT_NAME) {
      // For concept name, only include the concept name itself
      return fieldItems.some(history => history.id === target && history.newValue === conceptName)
    }
  }

  // Special handling for RANK group which includes both RankLevel and RankName fields
  if (group === PENDING.GROUP.RANK) {
    const rankLevelItems = fieldPending(pendingConcept, 'RankLevel')
    const rankNameItems = fieldPending(pendingConcept, 'RankName')
    return (
      rankLevelItems.some(history => history.id === target) ||
      rankNameItems.some(history => history.id === target)
    )
  }

  return pendingConcept.some(history => history.id === target)
  // return fieldPending(pendingConcept, fieldName).some(history => history.id === target)
}

export const createPendingGroupApprovalHook = group => {
  return () => {
    const { pending } = use(ConceptContext)

    const pendingConfirm = pending(PENDING.DATA.CONFIRM)

    return useMemo(() => {
      if (!pendingConfirm) {
        return null
      }

      if (pendingConfirm?.change === PENDING.GROUP.ALL) {
        return pendingConfirm.approval
      }

      if (pendingConfirm.group === group) {
        return pendingConfirm.approval
      }

      return OTHER
    }, [pendingConfirm])
  }
}

const createParametrizedPendingApprovalHook = () => {
  return target => {
    const { concept, pending } = use(ConceptContext)

    const pendingConcept = pending(PENDING.DATA.CONCEPT)
    const pendingConfirm = pending(PENDING.DATA.CONFIRM)

    return useMemo(() => {
      if (!pendingConfirm) {
        return null
      }

      if (pendingConfirm?.group === PENDING.GROUP.ALL) {
        return pendingConfirm.approval
      }

      if (pendingConfirm.group === target) {
        return pendingConfirm.approval
      }

      // Check if this target is part of a selected group or is an individual item that is pending
      if (isTargetInGroup(target, pendingConfirm.group, pendingConcept, concept.name)) {
        return pendingConfirm.approval
      }

      return OTHER
    }, [pendingConfirm, target, pendingConcept, concept.name])
  }
}

export const getPendingIds = (pendingConcept, targetGroup, conceptName) => {
  const fieldName = getFieldNameForGroup(targetGroup)

  let pendingIds
  if (targetGroup === PENDING.GROUP.ALL) {
    pendingIds = pendingConcept.map(history => history.id)
  } else if (fieldName) {
    // Special handling for RANK group which includes both RankLevel and RankName fields
    if (targetGroup === PENDING.GROUP.RANK) {
      const rankLevelItems = fieldPending(pendingConcept, 'RankLevel')
      const rankNameItems = fieldPending(pendingConcept, 'RankName')
      pendingIds = [...rankLevelItems, ...rankNameItems].map(history => history.id)
    } else {
      const fieldItems = fieldPending(pendingConcept, fieldName)

      // Special handling for ALIASES and CONCEPT_NAME groups since they share the same field
      if (targetGroup === PENDING.GROUP.ALIASES) {
        // For aliases, exclude the concept name itself
        pendingIds = fieldItems
          .filter(history => history.newValue !== conceptName)
          .map(history => history.id)
      } else if (targetGroup === PENDING.GROUP.CONCEPT_NAME) {
        // For concept name, only include the concept name itself
        pendingIds = fieldItems
          .filter(history => history.newValue === conceptName)
          .map(history => history.id)
      } else {
        pendingIds = fieldItems.map(history => history.id)
      }
    }
  } else {
    // For individual items, the target is the history ID itself
    pendingIds = [targetGroup]
  }

  return pendingIds
}

export const usePendingAliasesApproval = createPendingGroupApprovalHook(PENDING.GROUP.ALIASES)
export const usePendingChildrenApproval = createPendingGroupApprovalHook(PENDING.GROUP.CHILDREN)
export const usePendingItemApproval = createParametrizedPendingApprovalHook()
export const usePendingMediaApproval = createPendingGroupApprovalHook(PENDING.GROUP.MEDIA)
export const usePendingParentApproval = createPendingGroupApprovalHook('Concept.parent')
export const usePendingRankApproval = createPendingGroupApprovalHook(PENDING.GROUP.RANK)
export const usePendingRealizationsApproval = createPendingGroupApprovalHook(
  PENDING.GROUP.REALIZATIONS
)

// CxTBD ?????
export const useFieldPendingApproval = createParametrizedPendingApprovalHook()

// Special hook for concept name that can handle both group and individual field approval
export const useConceptNamePendingApproval = () => {
  const { concept, pending } = use(ConceptContext)

  const pendingConfirm = pending(PENDING.DATA.CONFIRM)
  const pendingConcept = pending(PENDING.DATA.CONCEPT)

  return useMemo(() => {
    if (!pendingConfirm) {
      return null
    }

    if (pendingConfirm?.group === PENDING.GROUP.ALL) {
      return pendingConfirm.approval
    }

    if (pendingConfirm.group === PENDING.GROUP.CONCEPT_NAME) {
      return pendingConfirm.approval
    }

    // Check if this is an individual concept name field being approved
    if (typeof pendingConfirm.group === 'string' || typeof pendingConfirm.group === 'number') {
      // It's a field ID, check if it's a concept name field
      const fieldItems = fieldPending(pendingConcept, 'ConceptName')
      const isConceptNameField = fieldItems.some(
        history => history.id === pendingConfirm.group && history.newValue === concept.name
      )
      if (isConceptNameField) {
        return pendingConfirm.approval
      }
    }

    return OTHER
  }, [pendingConfirm, pendingConcept, concept.name])
}
