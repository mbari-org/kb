const applyRank = (concept, tracker) => {
  concept.rankLevel = tracker.update.rankLevel
  concept.rankName = tracker.update.rankName
}

export default applyRank
