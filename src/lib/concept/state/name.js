import { ACTION } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

const nameState = (concept, pendingConcept) => {
  const { name } = concept

  const stateName = {
    action: CONCEPT_STATE.NO_ACTION,
    value: name,
    extent: '',
  }

  return stagedName(stateName, pendingConcept)
}

const editName = (state, update) => {
  return {
    ...state,
    name: {
      ...state.name,
      ...update,
    },
  }
}

const isPendingName = pendingItem =>
  pendingItem.field === HISTORY_FIELD.NAME &&
  pendingItem.action === ACTION.EDIT &&
  pendingItem.concept === pendingItem.newValue

const resetName = (state, update) => {
  return {
    ...state,
    name: update.name,
  }
}

const stagedName = (name, pendingConcept) => {
  const pendingName = pendingConcept.find(isPendingName)
  if (pendingName) {
    return {
      name: {
        action: 'Edit Pending',
        historyId: pendingName.id,
        value: pendingName.newValue,
        extent: '',
      },
    }
  }
  return { name }
}

export { editName, isPendingName, nameState, resetName }
