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

    case PENDING.GROUP.MEDIA:
      return 'Media'

    case 'Concept.parent':
      return 'Concept.parent'

    default:
      return null
  }
}

const isTargetInGroup = (target, group, conceptPending) => {
  const fieldName = getFieldNameForGroup(group)
  return fieldName
    ? fieldPending(conceptPending, fieldName).some(history => history.id === target)
    : false
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
      if (isTargetInGroup(target, confirmPending.pending, conceptPending)) {
        return confirmPending.approval
      }

      return OTHER
    }, [confirmPending, target, conceptPending])
  }
}

export const getPendingIds = (conceptPending, target) => {
  const fieldName = getFieldNameForGroup(target)

  const pendingIds =
    target === PENDING.GROUP.ALL
      ? conceptPending.map(history => history.id)
      : fieldName
      ? fieldPending(conceptPending, fieldName).map(history => history.id)
      : [target] // For individual items, the target is the history ID itself

  return pendingIds
}

export const useAliasesPendingApproval = createPendingApprovalHook(PENDING.GROUP.ALIASES)
export const useChildrenPendingApproval = createPendingApprovalHook(PENDING.GROUP.CHILDREN)
export const useMediaPendingApproval = createPendingApprovalHook(PENDING.GROUP.MEDIA)
export const useParentPendingApproval = createPendingApprovalHook('Concept.parent')
export const useFieldPendingApproval = createParametrizedPendingApprovalHook()
export const useItemPendingApproval = createParametrizedPendingApprovalHook()
