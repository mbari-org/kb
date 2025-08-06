import { CONCEPT_STATE, HISTORY_FIELD } from '@/lib/constants'

const editParent = (state, update) => {
  const { field, value } = update
  return { ...state, [field]: value }
}

const isPendingParent = pendingConcept => pendingConcept.field === HISTORY_FIELD.PARENT

const parentState = (concept, pendingConcept) => {
  const { parent } = concept

  const stateParent = {
    action: CONCEPT_STATE.NO_ACTION,
    value: parent,
  }

  return stagedParent(stateParent, pendingConcept)
}

const resetParent = (state, update) => {
  return { ...state, ...update }
}

const stagedParent = (stateParent, pendingConcept) => {
  const pendingParent = pendingConcept.find(isPendingParent)
  if (pendingParent) {
    return {
      action: 'Edit Parent',
      historyId: pendingParent.id,
      value: pendingParent.newValue,
    }
  }

  return { parent: { ...stateParent, action: CONCEPT_STATE.NO_ACTION } }
}

export { editParent, isPendingParent, parentState, resetParent, stagedParent }
