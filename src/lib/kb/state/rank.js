const rankState = concept => {
  const { rankLevel, rankName } = concept
  return {
    rank: {
      level: rankLevel || '',
      name: rankName || '',
    },
  }
}

const editRank = (state, update) => {
  const { field, value } = update

  return {
    ...state,
    rank: {
      ...state.rank,
      [field]: value,
    },
  }
}

const resetRank = (state, update) => {
  return {
    ...state,
    rank: update.rank,
  }
}

export { editRank, rankState, resetRank }
