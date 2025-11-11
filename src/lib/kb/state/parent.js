import { HISTORY_FIELD } from '@/lib/constants/historyField.js'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const editParent = (state, update) => {
  // update: { field: 'parent', value: newParentName }
  const { value } = update
  return {
    ...state,
    parent: {
      ...state.parent,
      action: CONCEPT_STATE.PARENT,
      value,
    },
  }
}

const isPendingParent = pendingItem => pendingItem.field === HISTORY_FIELD.PARENT

const parentState = (concept, pendingConcept) => {
  const { parent } = concept

  const stateParent = {
    action: CONCEPT_STATE.NO_ACTION,
    value: parent,
  }

  return stagedParent(stateParent, pendingConcept)
}

const resetParent = (state, update) => {
  // update: { parent: { action, value, historyId? } }
  return {
    ...state,
    parent: update.parent,
  }
}

const stagedParent = (stateParent, pendingConcept) => {
  const pendingParent = pendingConcept.find(isPendingParent)
  if (pendingParent) {
    return {
      parent: {
        action: 'Edit Pending',
        historyId: pendingParent.id,
        value: pendingParent.newValue,
      },
    }
  }

  return { parent: stateParent }
}

export { editParent, isPendingParent, parentState, resetParent, stagedParent }
