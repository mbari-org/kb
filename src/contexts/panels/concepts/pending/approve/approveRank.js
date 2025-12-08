import { rankValues } from '@/lib/model/rank'

const approveRank = (concept, item) => {
  const { level, name } = rankValues(item.newValue)
  concept.rankLevel = level
  concept.rankName = name
}

export default approveRank
