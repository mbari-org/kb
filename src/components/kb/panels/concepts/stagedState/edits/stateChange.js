const hasStateChange = (initialState, stagedState) =>
  JSON.stringify(stagedState) !== JSON.stringify(initialState)

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
