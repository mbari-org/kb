const rankState = concept => {
  const { rankLevel, rankName } = concept
  return {
    rankLevel: rankLevel || '',
    rankName: rankName || '',
  }
}

export { rankState }
