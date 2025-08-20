import { stagedEdits } from '@/lib/kb/state/staged'

import { matchingRealizationString } from '@/lib/kb/model/realizations'

import { ACTION, CONCEPT_STATE, HISTORY_FIELD } from '@/lib/constants'

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

const isMatching = (realization, pendingRealization) => {
  const realizationString =
    pendingRealization.action !== ACTION.DELETE
      ? pendingRealization.newValue
      : pendingRealization.oldValue

  return matchingRealizationString(realization, realizationString)

  // switch (pendingRealization.action) {
  //   case ACTION.ADD: {
  //     return matchingRealizationString(realization, pendingRealization.newValue)
  //   }

  //   case ACTION.DELETE: {
  //     return matchingRealizationString(realization, pendingRealization.oldValue)
  //   }

  //   case ACTION.EDIT: {
  //     return matchingRealizationString(realization, pendingRealization.newValue)
  //   }

  //   default:
  //     return false
  // }
}

const isPendingRealization = pendingItem => pendingItem.field === HISTORY_FIELD.REALIZATION

const realizationEdits = realizations => {
  return stagedEdits({
    displayFields: REALIZATION_DISPLAY_FIELDS,
    initial: realizations.initial,
    staged: realizations.staged,
    stateTypes: CONCEPT_STATE.REALIZATION,
  })
}

const realizationState = (realization, pendingRealizations) => {
  const pendingRealization = pendingRealizations.find(pendingItem =>
    isMatching(realization, pendingItem)
  )
  if (pendingRealization) {
    return {
      ...realization,
      action: pendingRealization.action + ' Pending',
      historyId: pendingRealization.id,
    }
  }
  return { ...realization, action: CONCEPT_STATE.NO_ACTION }
}

const realizationsState = (concept, pendingConcept) => {
  const pendingRealizations = pendingConcept.filter(isPendingRealization)
  const stagedRealizations = concept.realizations.map((realization, index) =>
    realizationState({ ...realization, index }, pendingRealizations)
  )
  return { realizations: stagedRealizations }
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

const stagedRealizationEdits = stagedEdit => {
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
  isPendingRealization,
  realizationEdits,
  realizationsState,
  realizationState,
  resetRealizations,
  stagedRealizationEdits,
}
