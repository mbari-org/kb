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

const resetValue = (state, update) => {
  return { ...state, ...update }
}

export { editValue, resetValue, valueState }
