import { pendingItems } from '@/lib/kb/model/history'

import { PENDING } from '@/lib/constants/pending.js'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

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

export const getPendingIds = (pendingConcept, targetGroup) => {
  const fieldName = historyFieldForGroup(targetGroup)

  if (targetGroup === GROUP.ALL) {
    return pendingConcept.map(history => history.id)
  }

  if (fieldName) {
    return pendingItems(pendingConcept, fieldName).map(history => history.id)
  }

  return [targetGroup]
}
