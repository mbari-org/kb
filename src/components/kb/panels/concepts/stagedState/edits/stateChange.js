import { dropFields } from '@/lib/util'

const hasStateChange = (allInitialState, allStagedState) => {
  // Drop fields that are not relevant to state change comparison
  const initialState = dropFields(allInitialState, ['aliasIndex', 'mediaIndex'])
  const stagedState = dropFields(allStagedState, ['aliasIndex', 'mediaIndex'])
  return JSON.stringify(stagedState) !== JSON.stringify(initialState)
}

const stateChange = (initialState, stagedState) => {
  if (!hasStateChange(initialState, stagedState)) {
    return {}
  }

  return stateChanges(initialState, stagedState).reduce((edits, [field, initial, editing]) => {
    edits[field] = { initial, editing }
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

export { hasStateChange, stateChange }
