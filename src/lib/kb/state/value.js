const valueState = (concept, field) => {
  const { [field]: value } = concept
  return {
    [field]: value,
  }
}

const editValue = (state, update) => {
  const { field, value } = update
  return { ...state, [field]: value }
}

const isPendingValue = (pendingItem, field) => pendingItem.field === field

const resetValue = (state, update) => {
  return { ...state, ...update }
}

export { editValue, isPendingValue, resetValue, valueState }
