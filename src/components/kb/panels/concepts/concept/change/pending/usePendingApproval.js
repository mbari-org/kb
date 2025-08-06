import { fieldPending } from '@/lib/kb/model/history'

import { HISTORY_FIELD, PENDING } from '@/lib/constants'

const { GROUP } = PENDING

const historyFieldForGroup = group => {
  switch (group) {
    case GROUP.ALIASES:
      return HISTORY_FIELD.ALIAS

    case GROUP.CHILDREN:
      return HISTORY_FIELD.CHILD

    case GROUP.MEDIA:
      return HISTORY_FIELD.MEDIA

    case GROUP.NAME:
      return HISTORY_FIELD.NAME

    case GROUP.PARENT:
      return HISTORY_FIELD.PARENT

    case GROUP.RANK:
      return HISTORY_FIELD.RANK

    case GROUP.REALIZATIONS:
      return HISTORY_FIELD.REALIZATION

    default:
      return null
  }
}

export const getPendingIds = (pendingConcept, targetGroup, conceptName) => {
  const fieldName = historyFieldForGroup(targetGroup)

  let pendingIds
  if (targetGroup === GROUP.ALL) {
    pendingIds = pendingConcept.map(history => history.id)
  } else if (fieldName) {
    const fieldItems = fieldPending(pendingConcept, fieldName)

    // Special handling for ALIASES and NAME since they share the same API field
    // if (targetGroup === GROUP.ALIASES) {
    //   pendingIds = fieldItems
    //     .filter(history => history.newValue !== conceptName)
    //     .map(history => history.id)
    // } else if (targetGroup === GROUP.NAME) {
    //   pendingIds = fieldItems
    //     .filter(history => history.newValue === conceptName)
    //     .map(history => history.id)
    // } else {
    pendingIds = fieldItems.map(history => history.id)
    // }
  } else {
    pendingIds = [targetGroup]
  }

  return pendingIds
}
