const hasStateChange = (initialState, editingState) =>
  JSON.stringify(editingState) !== JSON.stringify(initialState)

const stateChange = (initialState, editingState) => {
  if (!hasStateChange(initialState, editingState)) {
    return {}
  }

  return stateChanges(initialState, editingState).reduce((edits, [field, initial, editing]) => {
    edits[field] = { initial, editing }
    return edits
  }, {})
}

const stateChanges = (initialState, editingState) => {
  return Object.keys(editingState).reduce((changes, field) => {
    if (editingState[field] !== initialState[field]) {
      changes.push([field, initialState[field], editingState[field]])
    }
    return changes
  }, [])
}

export { hasStateChange, stateChange }
