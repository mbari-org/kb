import { generalStateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

const editParent = ({ stagedState, update }) => {
  // update: { field: 'parent', value: newParentName }
  const { value } = update
  return {
    ...stagedState,
    parent: {
      ...stagedState.parent,
      action: CONCEPT_STATE.PARENT,
      value,
    },
  }
}

const isPendingParent = pendingItem => pendingItem.field === HISTORY_FIELD.PARENT

const initialState = (concept, pendingConcept) => {
  const { parent } = concept

  const stateParent = {
    action: CONCEPT_STATE.NO_ACTION,
    value: parent,
  }

  return stagedParent(stateParent, pendingConcept)
}

const resetParent = ({ stagedState, update }) => {
  // update: { parent: { action, value, historyId? } }
  return {
    ...stagedState,
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

const isModified = (initial, staged) => initial?.parent?.value !== staged?.parent?.value

const stateUpdates = (initial, staged) => generalStateUpdates('parent', initial, staged)

export { editParent, initialState, isModified, isPendingParent, resetParent, stagedParent, stateUpdates }
