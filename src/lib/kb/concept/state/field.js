const fieldState = concept => {
  const { author, rankLevel, rankName } = concept
  return {
    author: author || 'unknown',
    rankLevel: rankLevel || '',
    rankName: rankName || '',
  }
}

const resetField = (state, update) => {
  const { field, value } = update
  return {
    ...state,
    [field]: value,
  }
}
const setField = (state, update) => {
  const { field, value } = update
  return {
    ...state,
    [field]: value,
  }
}

export { fieldState, resetField, setField }
