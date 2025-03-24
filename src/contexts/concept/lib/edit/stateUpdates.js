import { drop } from '@/lib/util'

const hasStateChange = (allInitialState, allStagedState) => {
  // Drop fields that are not relevant to state change comparison
  const initialState = drop(allInitialState, ['aliasIndex', 'mediaIndex'])
  const stagedState = drop(allStagedState, ['aliasIndex', 'mediaIndex'])
  return JSON.stringify(stagedState) !== JSON.stringify(initialState)
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
    if (stagedState[field] !== initialState[field]) {
      changes.push([field, initialState[field], stagedState[field]])
    }
    return changes
  }, [])
}

const updateInfo = (initialState, stagedState) => {
  const updates = stateUpdates(initialState, stagedState)
  const hasUpdate = field => !!updates[field]
  const updateValue = field => updates[field]?.staged
  const initialValue = field => updates[field]?.initial
  return { hasUpdate, initialValue, updateValue }
}

export { hasStateChange, stateUpdates, updateInfo }
