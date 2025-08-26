import { drop, isJsonEqual } from '@/lib/utils'

// const STATE_INDEXES = ['aliasIndex', 'mediaIndex', 'realizationIndex']

const hasStateChange = (allInitialState, allStagedState) => {
  // Drop fields that are not relevant to state change comparison
  const initialState = drop(allInitialState, ['aliasIndex', 'mediaIndex', 'realizationIndex'])
  const stagedState = drop(allStagedState, ['aliasIndex', 'mediaIndex', 'realizationIndex'])
  return !isJsonEqual(stagedState, initialState)
}

const stateUpdates = (initialState, stagedState) => {
  if (!hasStateChange(initialState, stagedState)) {
    return {}
  }

  return stateChanges(initialState, stagedState).reduce((edits, [field, initial, staged]) => {
    edits[field] = { initial, staged }
    return edits
  }, {})
}

const stateChanges = (initialState, stagedState) => {
  return Object.keys(stagedState).reduce((changes, field) => {
    if (!isJsonEqual(stagedState[field], initialState[field])) {
      changes.push([field, initialState[field], stagedState[field]])
    }
    return changes
  }, [])
}

const createUpdatesInfo = (initialState, stagedState) => {
  const forceLoad = false
  const updates = stateUpdates(initialState, stagedState)
  const hasUpdated = field => updates[field] !== undefined
  const initialValue = field => updates[field]?.initial
  const updatedValue = field => updates[field]?.staged
  return { forceLoad, hasUpdated, initialValue, updatedValue }
}

export { createUpdatesInfo, hasStateChange, stateUpdates }
