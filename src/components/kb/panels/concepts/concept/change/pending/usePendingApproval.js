import { fieldPending } from '@/lib/kb/model/history'

import { PENDING } from '@/lib/constants'

const { GROUP } = PENDING

const apiFieldNameForGroup = group => {
  switch (group) {
    case GROUP.ALIASES:
      return 'ConceptName'

    case GROUP.CHILDREN:
      return 'Concept.child'

    case GROUP.MEDIA:
      return 'Media'

    case GROUP.NAME:
      return 'ConceptName'

    case GROUP.PARENT:
      return 'Concept.parent'

    case GROUP.RANK:
      return 'Rank'

    case GROUP.REALIZATIONS:
      return 'LinkRealization'

    default:
      return null
  }
}

export const getPendingIds = (pendingConcept, targetGroup, conceptName) => {
  const fieldName = apiFieldNameForGroup(targetGroup)

  let pendingIds
  if (targetGroup === GROUP.ALL) {
    pendingIds = pendingConcept.map(history => history.id)
  } else if (fieldName) {
    // Special handling for RANK group which includes both RankLevel and RankName fields
    if (targetGroup === GROUP.RANK) {
      const rankLevelItems = fieldPending(pendingConcept, 'RankLevel')
      const rankNameItems = fieldPending(pendingConcept, 'RankName')
      pendingIds = [...rankLevelItems, ...rankNameItems].map(history => history.id)
    } else {
      const fieldItems = fieldPending(pendingConcept, fieldName)

      // Special handling for ALIASES and NAME groups since they share the same API field
      if (targetGroup === GROUP.ALIASES) {
        pendingIds = fieldItems
          .filter(history => history.newValue !== conceptName)
          .map(history => history.id)
      } else if (targetGroup === GROUP.NAME) {
        pendingIds = fieldItems
          .filter(history => history.newValue === conceptName)
          .map(history => history.id)
      } else {
        pendingIds = fieldItems.map(history => history.id)
      }
    }
  } else {
    pendingIds = [targetGroup]
  }

  return pendingIds
}
