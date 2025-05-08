const fieldState = concept => {
  const { author, rankLevel, rankName } = concept
  return {
    aliasIndex: 0,
    author: author || 'unknown',
    mediaIndex: 0,
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
