const applyRankResults = ({ concept, result }) => {
  concept.rankLevel = result.response.rankLevel
  concept.rankName = result.response.rankName
}

export default applyRankResults
