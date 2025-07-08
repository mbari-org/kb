const fieldState = concept => {
  const { author, rankLevel, rankName } = concept
  return {
    aliasIndex: 0,
    author: author || 'unknown',
    mediaIndex: 0,
    rankLevel: rankLevel || '',
    rankName: rankName || '',
    realizationIndex: 0,
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
