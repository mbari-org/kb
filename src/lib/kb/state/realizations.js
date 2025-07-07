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
  const { realizationIndex, realizationItem } = update
  const newRealizations = [...state.realizations]
  newRealizations.splice(realizationIndex, 0, {
    ...realizationItem,
    action: CONCEPT_STATE.REALIZATION.ADD,
    index: realizationIndex,
  })

  // Update indices for subsequent realizations
  for (let i = realizationIndex + 1; i < newRealizations.length; i++) {
    newRealizations[i].index = i
  }

  return {
    ...state,
    realizations: newRealizations,
    realizationIndex,
  }
}

const deleteRealization = (state, update) => {
  const { realizationIndex, realizationItem } = update
  const newRealizations = [...state.realizations]
  newRealizations[realizationIndex] = {
    ...realizationItem,
    action: CONCEPT_STATE.REALIZATION.DELETE,
  }

  return {
    ...state,
    realizations: newRealizations,
  }
}

const editRealization = (state, update) => {
  const { realizationIndex, realizationItem } = update
  const newRealizations = [...state.realizations]
  newRealizations[realizationIndex] = {
    ...realizationItem,
    action: CONCEPT_STATE.REALIZATION.EDIT,
    index: realizationIndex,
  }

  return {
    ...state,
    realizations: newRealizations,
  }
}

const resetRealization = (state, update) => {
  const { realizationIndex, realizationItem } = update
  const newRealizations = [...state.realizations]
  
  // If realizationItem is null/undefined, this was an ADD action
  // and we should remove the item entirely
  if (!realizationItem) {
    newRealizations.splice(realizationIndex, 1)
    // Update indices for subsequent realizations
    for (let i = realizationIndex; i < newRealizations.length; i++) {
      newRealizations[i].index = i
    }
  } else {
    // This was an EDIT action, reset to original state
    newRealizations[realizationIndex] = {
      ...realizationItem,
      action: CONCEPT_STATE.NO_ACTION,
      index: realizationIndex,
    }
  }

  return {
    ...state,
    realizations: newRealizations,
  }
}

const resetRealizations = (state, update) => {
  return {
    ...state,
    realizations: update.realizations || [],
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
