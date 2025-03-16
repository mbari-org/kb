import { updateConceptAuthor, updateConceptRank } from '@/lib/services/oni/api/concept'

import { prunePick } from '@/lib/util'

const updateDetail = (concept, updates, submit) => {
  const { author, rankLevel, rankName } = prunePick(updates, ['author', 'rankLevel', 'rankName'])
  if (!author && !rankLevel && !rankName) {
    return []
  }

  const stagedAuthor = author?.staged
  const stagedRankLevel = rankLevel?.staged
  const stagedRankName = rankName?.staged

  const submitters = []
  if (stagedAuthor) {
    submitters.push(() => submit(updateConceptAuthor, [concept.name, { author: stagedAuthor }]))
  }

  // Rank name and level must both be sent, even if only one changes.
  if (typeof stagedRankLevel === 'string' || typeof stagedRankName === 'string') {
    const rankUpdate = {
      rankLevel: typeof stagedRankLevel === 'string' ? stagedRankLevel : concept.rankLevel,
      rankName: typeof stagedRankName === 'string' ? stagedRankName : concept.rankName,
    }
    submitters.push(() => submit(updateConceptRank, [concept.name, rankUpdate]))
  }

  return submitters
}

export default updateDetail
