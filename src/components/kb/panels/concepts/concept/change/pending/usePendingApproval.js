import { use, useMemo } from 'react'

import PanelDataContext from '@/contexts/panelData/PanelDataContext'
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

    case PENDING.GROUP.REALIZATIONS:
      return 'LinkRealization'

    case 'Concept.parent':
      return 'Concept.parent'

    default:
      return null
  }
}

const isTargetInGroup = (target, group, conceptPending, conceptName) => {
  const fieldName = getFieldNameForGroup(group)
  if (!fieldName) {
    return false
  }

  // Special handling for ALIASES and CONCEPT_NAME groups since they share the same field
  if (group === PENDING.GROUP.ALIASES || group === PENDING.GROUP.CONCEPT_NAME) {
    const fieldItems = fieldPending(conceptPending, fieldName)

    if (group === PENDING.GROUP.ALIASES) {
      // For aliases, exclude the concept name itself
      return fieldItems.some(history => history.id === target && history.newValue !== conceptName)
    } else if (group === PENDING.GROUP.CONCEPT_NAME) {
      // For concept name, only include the concept name itself
      return fieldItems.some(history => history.id === target && history.newValue === conceptName)
    }
  }

  return fieldPending(conceptPending, fieldName).some(history => history.id === target)
}

const createPendingApprovalHook = targetPending => {
  return () => {
    const { confirmPending } = use(ConceptContext)

    return useMemo(() => {
      if (!confirmPending) {
        return null
      }

      if (confirmPending?.change === PENDING.GROUP.ALL) {
        return confirmPending.approval
      }

      if (confirmPending.pending === targetPending) {
        return confirmPending.approval
      }

      return OTHER
    }, [confirmPending])
  }
}

const createParametrizedPendingApprovalHook = () => {
  return target => {
    const { confirmPending, concept } = use(ConceptContext)
    const { pendingHistory } = use(PanelDataContext)

    const conceptPending = useMemo(() => {
      return pendingHistory.filter(history => history.concept === concept.name)
    }, [pendingHistory, concept.name])

    return useMemo(() => {
      if (!confirmPending) {
        return null
      }

      if (confirmPending?.change === PENDING.GROUP.ALL) {
        return confirmPending.approval
      }

      if (confirmPending.pending === target) {
        return confirmPending.approval
      }

      // Check if this target is part of a selected group
      if (isTargetInGroup(target, confirmPending.pending, conceptPending, concept.name)) {
        return confirmPending.approval
      }

      return OTHER
    }, [confirmPending, target, conceptPending, concept.name])
  }
}

export const getPendingIds = (conceptPending, target, conceptName) => {
  const fieldName = getFieldNameForGroup(target)

  let pendingIds
  if (target === PENDING.GROUP.ALL) {
    pendingIds = conceptPending.map(history => history.id)
  } else if (fieldName) {
    const fieldItems = fieldPending(conceptPending, fieldName)

    // Special handling for ALIASES and CONCEPT_NAME groups since they share the same field
    if (target === PENDING.GROUP.ALIASES) {
      // For aliases, exclude the concept name itself
      pendingIds = fieldItems
        .filter(history => history.newValue !== conceptName)
        .map(history => history.id)
    } else if (target === PENDING.GROUP.CONCEPT_NAME) {
      // For concept name, only include the concept name itself
      pendingIds = fieldItems
        .filter(history => history.newValue === conceptName)
        .map(history => history.id)
    } else {
      pendingIds = fieldItems.map(history => history.id)
    }
  } else {
    // For individual items, the target is the history ID itself
    pendingIds = [target]
  }

  return pendingIds
}

export const useAliasesPendingApproval = createPendingApprovalHook(PENDING.GROUP.ALIASES)
export const useChildrenPendingApproval = createPendingApprovalHook(PENDING.GROUP.CHILDREN)
export const useMediaPendingApproval = createPendingApprovalHook(PENDING.GROUP.MEDIA)
export const useRealizationsPendingApproval = createPendingApprovalHook(PENDING.GROUP.REALIZATIONS)
export const useParentPendingApproval = createPendingApprovalHook('Concept.parent')
export const useFieldPendingApproval = createParametrizedPendingApprovalHook()
export const useItemPendingApproval = createParametrizedPendingApprovalHook()

// Special hook for concept name that can handle both group and individual field approval
export const useConceptNamePendingApproval = () => {
  const { confirmPending, concept } = use(ConceptContext)
  const { pendingHistory } = use(PanelDataContext)

  const conceptPending = useMemo(() => {
    return pendingHistory.filter(history => history.concept === concept.name)
  }, [pendingHistory, concept.name])

  return useMemo(() => {
    if (!confirmPending) {
      return null
    }

    if (confirmPending?.change === PENDING.GROUP.ALL) {
      return confirmPending.approval
    }

    if (confirmPending.pending === PENDING.GROUP.CONCEPT_NAME) {
      return confirmPending.approval
    }

    // Check if this is an individual concept name field being approved
    if (typeof confirmPending.pending === 'string' || typeof confirmPending.pending === 'number') {
      // It's a field ID, check if it's a concept name field
      const fieldItems = fieldPending(conceptPending, 'ConceptName')
      const isConceptNameField = fieldItems.some(
        history => history.id === confirmPending.pending && history.newValue === concept.name
      )
      if (isConceptNameField) {
        return confirmPending.approval
      }
    }

    return OTHER
  }, [confirmPending, conceptPending, concept.name])
}
