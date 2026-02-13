import { generalStateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import { ACTION } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

import { isJsonEqual } from '@/lib/utils'

const initialState = (concept, pendingConcept) => {
  const { name } = concept

  const stateName = {
    action: CONCEPT_STATE.NO_ACTION,
    value: name,
    extent: '',
  }

  return stagedName(stateName, pendingConcept)
}

const editName = ({ stagedState, update }) => {
  return {
    ...stagedState,
    name: {
      ...stagedState.name,
      ...update,
    },
  }
}

const isPendingName = pendingItem =>
  pendingItem.field === HISTORY_FIELD.NAME &&
  pendingItem.action === ACTION.EDIT &&
  pendingItem.concept === pendingItem.newValue

const resetName = ({ stagedState, update }) => {
  return {
    ...stagedState,
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

const isModified = (initial, staged) => !isJsonEqual(initial?.name, staged?.name)

const stateUpdates = (initial, staged) => generalStateUpdates('name', initial, staged)

export { editName, initialState, isModified, isPendingName, resetName, stateUpdates }
