import { updateConceptAuthor, updateConceptRank } from '@/lib/services/oni/api/concept'

import { prunePick } from '@/lib/util'

const updateDetail = (concept, updates, submit) => {
  const { detailUpdates } = prunePick(updates, ['author', 'rankLevel', 'rankName'])
  if (!detailUpdates) {
    return []
  }

  const author = detailUpdates.author?.staged
  const rankLevel = detailUpdates.rankLevel?.staged
  const rankName = detailUpdates.rankName?.staged

  const submitters = []
  if (author) {
    submitters.push(() => submit(updateConceptAuthor, [concept.name, { author }]))
  }

  // Rank name and level must both be sent, even if only one changes.
  if (typeof rankLevel === 'string' || typeof rankName === 'string') {
    const rankUpdate = {
      rankLevel: typeof rankLevel === 'string' ? rankLevel : concept.rankLevel,
      rankName: typeof rankName === 'string' ? rankName : concept.rankName,
    }
    submitters.push(() => submit(updateConceptRank, [concept.name, rankUpdate]))
  }

  return submitters
}

export default updateDetail
