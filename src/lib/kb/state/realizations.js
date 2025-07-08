import { CONCEPT_STATE } from '@/lib/constants'

import { stagedRealization } from '@/lib/kb/model/realization'

const realizationsState = (concept, pending) => {
  const { realizations: conceptRealizations } = concept
  if (!conceptRealizations) {
    return []
  }

  const realizations = conceptRealizations.map((realization, index) =>
    stagedRealization({ ...realization, action: CONCEPT_STATE.NO_ACTION, index }, pending)
  )

  return { realizations }
}

const addRealization = (state, update) => {
  const realizationItem = {
    ...update.realizationItem,
    action: CONCEPT_STATE.REALIZATION_ITEM.ADD,
    index: state.realizations.length,
  }
  return {
    ...state,
    realizations: [...state.realizations, realizationItem],
  }
}

const deleteRealization = (state, update) => {
  const realizationItem = state.realizations[update.realizationIndex]
  // If realization is an add, just remove it from state
  if (realizationItem?.action === CONCEPT_STATE.REALIZATION_ITEM.ADD) {
    const updatedRealizations = state.realizations.filter(
      (_item, index) => index !== update.realizationIndex
    )
    return {
      ...state,
      realizations: updatedRealizations,
    }
  }
  return updateState(state, { type: CONCEPT_STATE.REALIZATION_ITEM.DELETE, update })
}

const editRealization = (state, update) => {
  const realizationItem = state.realizations[update.realizationIndex]
  // If editing an added realization, don't change the action
  if (realizationItem.action === CONCEPT_STATE.REALIZATION_ITEM.ADD) {
    const updatedItem = {
      ...update.realizationItem,
      action: CONCEPT_STATE.REALIZATION_ITEM.ADD,
    }
    return {
      ...state,
      realizations: state.realizations.map((item, index) =>
        index === update.realizationIndex ? updatedItem : item
      ),
    }
  }
  return updateState(state, { type: CONCEPT_STATE.REALIZATION_ITEM.EDIT, update })
}

const resetRealization = (state, update) => {
  const { realizationItem, realizationIndex } = update
  if (realizationItem) {
    return {
      ...state,
      realizations: state.realizations.map((item, index) =>
        index === realizationIndex ? realizationItem : item
      ),
    }
  }
  return {
    ...state,
    realizations: state.realizations.filter((_item, index) => index !== realizationIndex),
  }
}

const resetRealizations = (state, update) => {
  return {
    ...state,
    realizations: update.realizations,
  }
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
  realizationsState,
  resetRealization,
  resetRealizations,
}
