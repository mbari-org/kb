import { fieldEdits } from '@/lib/kb/model/field'

import { fieldPending } from './history'

import { pick } from '@/lib/utils'

import { CONCEPT_STATE } from '@/lib/constants'

const REALIZATION_DISPLAY_FIELDS = ['linkName', 'toConcept', 'linkValue']

const isSame = (a, b) =>
  a.linkName === b.linkName && a.toConcept === b.toConcept && a.linkValue === b.linkValue

const realizationEdits = ({ initial, staged }) =>
  fieldEdits({
    stateType: CONCEPT_STATE.REALIZATION_ITEM,
    displayFields: REALIZATION_DISPLAY_FIELDS,
    initial,
    staged,
  })

const realizationFields = realization => pick(realization, REALIZATION_DISPLAY_FIELDS)

const stagedRealization = (realization, conceptPending) => {
  const pendingRealizationActions = fieldPending(conceptPending, 'LinkRealization')

  const addRealizationMatch = history => {
    if (history.action !== 'ADD') {
      return false
    }

    const [newLinkName, newLinkToConcept, newLinkValue] = history.newValue.split(' | ')
    return (
      newLinkName === realization.linkName &&
      newLinkToConcept === realization.toConcept &&
      newLinkValue === realization.linkValue
    )
  }

  const pendingAdd = pendingRealizationActions.find(addRealizationMatch)
  if (pendingAdd) {
    return {
      ...realization,
      action: 'Pending Add',
      historyId: pendingAdd.id,
    }
  }

  const pendingDelete = pendingRealizationActions.find(
    history => history.action === 'DELETE' && history.oldValue === realization.linkName
  )
  if (pendingDelete) {
    return {
      ...realization,
      action: 'Pending Delete',
      historyId: pendingDelete.id,
    }
  }

  const pendingEdit = pendingRealizationActions.find(
    history => history.action === 'REPLACE' && history.newValue === realization.linkName
  )
  if (pendingEdit) {
    return {
      ...realization,
      action: 'Pending Edit',
      historyId: pendingEdit.id,
    }
  }

  return realization
}

const checkForDuplicate = (realizations, realization, excludeIndex = null) => {
  if (!realization.linkName || !realization.toConcept || !realization.linkValue) {
    return false
  }

  const realizationsToCheck =
    excludeIndex !== null ? realizations.filter((_, index) => index !== excludeIndex) : realizations

  return realizationsToCheck.some(existing => isSame(realization, existing))
}

export {
  checkForDuplicate,
  isSame,
  REALIZATION_DISPLAY_FIELDS,
  realizationEdits,
  realizationFields,
  stagedRealization,
}
