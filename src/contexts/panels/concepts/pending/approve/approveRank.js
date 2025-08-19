import { rankValues } from '@/lib/kb/model/rank'

const approveRank = (concept, item) => {
  const { level, name } = rankValues(item.newValue)
  concept.rankLevel = level
  concept.rankName = name
}

export default approveRank
