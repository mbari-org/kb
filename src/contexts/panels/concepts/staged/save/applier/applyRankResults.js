const applyRankResults = ({ concept, result }) => {
  concept.rankLevel = result.update.rankLevel
  concept.rankName = result.update.rankName
}

export default applyRankResults
