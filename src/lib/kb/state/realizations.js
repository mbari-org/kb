import { ACTION, CONCEPT_STATE } from '@/lib/constants'
import { stagedEdits } from '@/lib/kb/state/staged'

import { fieldPending } from '@/lib/kb/model/history'

const REALIZATION_DISPLAY_FIELDS = ['linkName', 'toConcept', 'linkValue']

const addRealization = (state, update) => {
  const realizationIndex = state.realizations.length
  const realizationItem = {
    ...update.realizationItem,
    action: CONCEPT_STATE.REALIZATION.ADD,
    index: realizationIndex,
  }
  return {
    ...state,
    realizations: [...state.realizations, realizationItem],
    realizationIndex,
  }
}

const deleteRealization = (state, update) => {
  const realizationItem = state.realizations[update.realizationIndex]
  // If realization is an add, just remove it from state
  if (realizationItem?.action === CONCEPT_STATE.REALIZATION.ADD) {
    const updatedRealizations = state.realizations.filter(
      (_item, index) => index !== update.realizationIndex
    )
    return {
      ...state,
      realizations: updatedRealizations,
    }
  }
  return updateState(state, { type: CONCEPT_STATE.REALIZATION.DELETE, update })
}

const editRealization = (state, update) => {
  const realizationItem = state.realizations[update.realizationIndex]
  // If editing an added realization, don't change the action
  if (realizationItem.action === CONCEPT_STATE.REALIZATION.ADD) {
    const updatedItem = {
      ...update.realizationItem,
      action: CONCEPT_STATE.REALIZATION.ADD,
    }
    return {
      ...state,
      realizations: state.realizations.map((item, index) =>
        index === update.realizationIndex ? updatedItem : item
      ),
    }
  }
  return updateState(state, { type: CONCEPT_STATE.REALIZATION.EDIT, update })
}

const realizationEdits = realizations => {
  return stagedEdits({
    displayFields: REALIZATION_DISPLAY_FIELDS,
    initial: realizations.initial,
    staged: realizations.staged,
    stateTypes: CONCEPT_STATE.REALIZATION,
  })
}

const realizationsState = (concept, pending) => {
  const { realizations } = concept
  const stagedRealizationsList = realizations.map((realization, index) =>
    stagedRealization({ ...realization, action: CONCEPT_STATE.NO_ACTION, index }, pending)
  )
  return { realizations: stagedRealizationsList }
}

const resetRealizations = (state, update) => {
  const { index: resetIndex } = update

  if (1 < state.realizations.length && resetIndex !== undefined) {
    const realization = update.realizations[resetIndex]
    return {
      ...state,
      realizations: state.realizations.reduce((acc, item, index) => {
        index === resetIndex ? realization != null && acc.push(realization) : acc.push(item)
        return acc
      }, []),
    }
  }
  return {
    ...state,
    realizations: update.realizations,
  }
}

const stagedRealization = (realization, pendingConcept) => {
  const pendingRealizationActions = fieldPending(pendingConcept, 'LinkRealization')

  const addRealizationMatch = history => {
    if (history.action !== ACTION.ADD) {
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
    history => history.action === ACTION.DELETE && history.oldValue === realization.linkName
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

const stagedRealizations = stagedEdit => {
  const [_field, realizations] = stagedEdit

  return stagedEdits({
    displayFields: REALIZATION_DISPLAY_FIELDS,
    initial: realizations.initial,
    staged: realizations.staged,
    stateTypes: CONCEPT_STATE.REALIZATION,
  })
}

const updateState = (state, { type, update }) => {
  const { realizationIndex, realizationItem } = update
  const updatedItem = { ...state.realizations[realizationIndex], ...realizationItem, action: type }
  return {
    ...state,
    realizations: state.realizations.map((item, index) =>
      index === realizationIndex ? updatedItem : item
    ),
  }
}

export {
  addRealization,
  deleteRealization,
  editRealization,
  realizationEdits,
  realizationsState,
  resetRealizations,
  stagedRealization,
  stagedRealizations,
}
