import { puid } from 'puid-js'

import { stagedEdits } from '@/lib/concept/state/staged'

import { matchingRealizationString, sortRealizations } from '@/lib/model/realization'

import { ACTION } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

import { REALIZATION_VALUE_FIELDS } from '@/lib/model/realization'

import { isJsonEqual } from '@/lib/utils'

const { generator, error: generatorError } = puid({ total: 10, risk: 1e15 })
if (generatorError) throw generatorError

const genStateId = () => generator()

const alignRealizationsByStateId = (initial, staged) => {
  if (!staged || !initial) return staged
  const initialByStateId = initial.reduce((acc, item) => {
    acc[item.stateId] = item
    return acc
  }, {})
  return staged
    .map(stagedItem => {
      const initialItem = initialByStateId[stagedItem.stateId]
      return initialItem || stagedItem
    })
    .filter(item => initialByStateId[item.stateId])
}

const addRealization = ({ stagedState, update }) => {
  const realizationItem = {
    ...update.realizationItem,
    action: CONCEPT_STATE.REALIZATION.ADD,
    stateId: genStateId(),
  }

  const updatedRealizations = sortRealizations([...stagedState.realizations, realizationItem])
  return {
    ...stagedState,
    realizations: updatedRealizations,
    realizationIndex: updatedRealizations.findIndex(item => item.stateId === realizationItem.stateId),
  }
}

const deleteRealization = ({ stagedState, update }) => {
  const realizationItem = stagedState.realizations.find(item => item.stateId === update.realizationStateId)
  // If realization is an add, just remove it from state
  if (realizationItem?.action === CONCEPT_STATE.REALIZATION.ADD) {
    const updatedRealizations = stagedState.realizations.filter(
      item => item.stateId !== update.realizationStateId
    )
    return {
      ...stagedState,
      realizations: updatedRealizations,
    }
  }
  return updateState({ stagedState, update, type: CONCEPT_STATE.REALIZATION.DELETE })
}

const editRealization = ({ stagedState, update }) => {
  const realizationItem = stagedState.realizations.find(item => item.stateId === update.realizationStateId)
  // If editing an added realization, don't change the action
  if (realizationItem.action === CONCEPT_STATE.REALIZATION.ADD) {
    const updatedItem = {
      ...update.realizationItem,
      action: CONCEPT_STATE.REALIZATION.ADD,
    }
    return {
      ...stagedState,
      realizations: stagedState.realizations.map(item =>
        item.stateId === update.realizationStateId ? updatedItem : item
      ),
    }
  }
  return updateState({ stagedState, update, type: CONCEPT_STATE.REALIZATION.EDIT })
}

const isMatching = (realization, pendingRealization) => {
  const realizationString =
    pendingRealization.action !== ACTION.DELETE ? pendingRealization.newValue : pendingRealization.oldValue

  return matchingRealizationString(realization, realizationString)
}

const isPendingRealization = pendingItem => pendingItem.field === HISTORY_FIELD.REALIZATION

const realizationEdits = realizations => {
  return stagedEdits({
    displayFields: REALIZATION_VALUE_FIELDS,
    initial: realizations.initial,
    staged: realizations.staged,
    stateTypes: CONCEPT_STATE.REALIZATION,
  })
}

const realizationState = (realization, pendingRealizations) => {
  const pendingRealization = pendingRealizations.find(pendingItem => isMatching(realization, pendingItem))
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
  const stagedRealizations = concept.realizations.map(realization =>
    realizationState({ ...realization, stateId: genStateId() }, pendingRealizations)
  )
  return { realizations: sortRealizations(stagedRealizations) }
}

const resetRealizations = ({ stagedState, update }) => {
  const { stateId: resetStateId, realizations: resetRealizationsArray } = update

  if (1 < stagedState.realizations.length && resetStateId !== undefined) {
    const resetItem = resetRealizationsArray.find(item => item.stateId === resetStateId)
    if (resetItem) {
      return {
        ...stagedState,
        realizations: stagedState.realizations.map(item => (item.stateId === resetStateId ? resetItem : item)),
      }
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
    displayFields: REALIZATION_VALUE_FIELDS,
    initial: realizations.initial,
    staged: realizations.staged,
    stateTypes: CONCEPT_STATE.REALIZATION,
  })
}

const updateState = ({ stagedState, update, type }) => {
  const { realizationStateId, realizationItem } = update
  const updatedItem = {
    ...stagedState.realizations.find(item => item.stateId === realizationStateId),
    ...realizationItem,
    action: type,
  }
  return {
    ...stagedState,
    realizations: stagedState.realizations.map(item => (item.stateId === realizationStateId ? updatedItem : item)),
  }
}

const isModified = (initial, staged) => {
  const alignedInitial = alignRealizationsByStateId(initial?.realizations, staged?.realizations)
  return !isJsonEqual(staged?.realizations, alignedInitial)
}

const stateUpdates = (initial, staged) => {
  const aligned = alignRealizationsByStateId(initial?.realizations, staged?.realizations)
  return !isJsonEqual(aligned, staged?.realizations)
    ? { realizations: { initial: aligned, staged: staged?.realizations } }
    : {}
}

export {
  addRealization,
  alignRealizationsByStateId,
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
