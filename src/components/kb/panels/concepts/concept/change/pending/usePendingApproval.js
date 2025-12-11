import { pendingItems } from '@/lib/model/history'

import CONFIG from '@/text'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

const { CONCEPT: group } = CONFIG.PANELS.CONCEPTS.MODALS

const historyFieldForGroup = groupValue => {
  switch (groupValue) {
    case group.ALIASES:
      return HISTORY_FIELD.ALIAS

    case group.CHILDREN:
      return HISTORY_FIELD.CHILD

    case group.MEDIA:
      return HISTORY_FIELD.MEDIA

    case group.NAME:
      return HISTORY_FIELD.NAME

    case group.PARENT:
      return HISTORY_FIELD.PARENT

    case group.RANK:
      return HISTORY_FIELD.RANK

    case group.REALIZATIONS:
      return HISTORY_FIELD.REALIZATION

    default:
      return null
  }
}

export const getPendingIds = (pendingConcept, targetGroup) => {
  const fieldName = historyFieldForGroup(targetGroup)

  if (targetGroup === group.ALL) {
    return pendingConcept.map(history => history.id)
  }

  if (fieldName) {
    return pendingItems(pendingConcept, fieldName).map(history => history.id)
  }

  return [targetGroup]
}
