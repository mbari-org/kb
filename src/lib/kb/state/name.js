import { ACTION, CONCEPT_STATE, HISTORY_FIELD } from '@/lib/constants'

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
        ...name,
        action: 'Edit Pending',
        historyId: pendingName.id,
        value: pendingName.value,
        extent: pendingName.extent,
      },
    }
  }
  return { name }
}

export { editName, isPendingName, nameState, resetName }
