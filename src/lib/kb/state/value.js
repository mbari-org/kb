const valueState = (concept, field, fieldValue) => {
  const { [field]: conceptValue } = concept
  const value = fieldValue ?? conceptValue
  return {
    [field]: value,
  }
}

const editValue = (state, update) => {
  const { field, value } = update
  return { ...state, [field]: value }
}

export { editValue, valueState }
