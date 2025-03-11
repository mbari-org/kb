import { updateConceptAuthor, updateConceptRank } from '@/lib/services/oni/api/concept'

import { updatedFields } from '@/lib/util'

const updateDetail = async (updates, result, process) => {
  const fieldUpdates = updatedFields(updates, ['author', 'rankLevel', 'rankName'])

  if (!fieldUpdates) {
    return result
  }

  const { concept } = result
  let detailResult = { ...result }

  const author = fieldUpdates.author?.staged
  const rankLevel = fieldUpdates.rankLevel?.staged
  const rankName = fieldUpdates.rankName?.staged

  if (author) {
    detailResult = await process(updateConceptAuthor, { author }, detailResult)
  }

  // Rank name and level must both be sent, even if only one changes.
  if (typeof rankLevel === 'string' || typeof rankName === 'string') {
    const rankUpdate = {
      rankLevel: typeof rankLevel === 'string' ? rankLevel : concept.rankLevel,
      rankName: typeof rankName === 'string' ? rankName : concept.rankName,
    }
    detailResult = await process(updateConceptRank, rankUpdate, detailResult)
  }

  return detailResult
}

export default updateDetail
