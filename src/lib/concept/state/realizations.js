import { generalStateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import { stagedEdits } from '@/lib/concept/state/staged'

import { matchingRealizationString, sortRealizations } from '@/lib/model/realization'

import { ACTION } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

import { isJsonEqual } from '@/lib/utils'

const REALIZATION_DISPLAY_FIELDS = ['linkName', 'toConcept', 'linkValue']

const addRealization = ({ stagedState, update }) => {
  const realizationIndex = stagedState.realizations.length
  const realizationItem = {
    ...update.realizationItem,
    action: CONCEPT_STATE.REALIZATION.ADD,
    index: realizationIndex,
  }

  const updatedRealizations = [...stagedState.realizations, realizationItem]
  return {
    ...stagedState,
    realizations: sortRealizations(updatedRealizations),
    realizationIndex,
  }
}

const deleteRealization = ({ stagedState, update }) => {
  const realizationItem = stagedState.realizations[update.realizationIndex]
  // If realization is an add, just remove it from state
  if (realizationItem?.action === CONCEPT_STATE.REALIZATION.ADD) {
    const updatedRealizations = stagedState.realizations.filter(
      (_item, index) => index !== update.realizationIndex
    )
    return {
      ...stagedState,
      realizations: updatedRealizations,
    }
  }
  return updateState({ stagedState, update, type: CONCEPT_STATE.REALIZATION.DELETE })
}

const editRealization = ({ stagedState, update }) => {
  const realizationItem = stagedState.realizations[update.realizationIndex]
  // If editing an added realization, don't change the action
  if (realizationItem.action === CONCEPT_STATE.REALIZATION.ADD) {
    const updatedItem = {
      ...update.realizationItem,
      action: CONCEPT_STATE.REALIZATION.ADD,
    }
    return {
      ...stagedState,
      realizations: stagedState.realizations.map((item, index) =>
        index === update.realizationIndex ? updatedItem : item
      ),
    }
  }
  return updateState({ stagedState, update, type: CONCEPT_STATE.REALIZATION.EDIT })
}

const isMatching = (realization, pendingRealization) => {
  const realizationString =
    pendingRealization.action !== ACTION.DELETE
      ? pendingRealization.newValue
      : pendingRealization.oldValue

  return matchingRealizationString(realization, realizationString)
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

const initialState = (concept, pendingConcept) => {
  const pendingRealizations = pendingConcept.filter(isPendingRealization)
  const stagedRealizations = concept.realizations.map((realization, index) =>
    realizationState({ ...realization, index }, pendingRealizations)
  )
  return { realizations: sortRealizations(stagedRealizations) }
}

const resetRealizations = ({ stagedState, update }) => {
  const { index: resetIndex } = update

  if (1 < stagedState.realizations.length && resetIndex !== undefined) {
    const realization = update.realizations[resetIndex]
    return {
      ...stagedState,
      realizations: stagedState.realizations.reduce((acc, item, index) => {
        index === resetIndex ? realization != null && acc.push(realization) : acc.push(item)
        return acc
      }, []),
    }
  }
  return {
    ...stagedState,
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

const updateState = ({ stagedState, update, type }) => {
  const { realizationIndex, realizationItem } = update
  const updatedItem = { ...stagedState.realizations[realizationIndex], ...realizationItem, action: type }
  return {
    ...stagedState,
    realizations: stagedState.realizations.map((item, index) =>
      index === realizationIndex ? updatedItem : item
    ),
  }
}

const isModified = (initial, staged) => !isJsonEqual(initial?.realizations, staged?.realizations)

const stateUpdates = (initial, staged) => generalStateUpdates('realizations', initial, staged)

export {
  addRealization,
  deleteRealization,
  editRealization,
  initialState,
  isModified,
  isPendingRealization,
  realizationEdits,
  realizationState,
  resetRealizations,
  stagedRealizationEdits,
  stateUpdates,
}

