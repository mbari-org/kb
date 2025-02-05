import {
  updateConceptAuthor,
  updateConceptRank,
} from "@/lib/services/oni/api/concept"

// Updates are transactional; the original concept is returned if any error occurs.
const detailUpdates = async (updates, result, nextResult) => {
  const { author, rankLevel, rankName } = updates
  const { concept } = result

  let detailResult = { ...result }

  if (author) {
    detailResult = await nextResult(result, { author }, updateConceptAuthor)
  }

  // Rank name and level must both be sent, even if only one changes.
  if (typeof rankLevel === "string" || typeof rankName === "string") {
    const rankUpdate = {
      rankLevel: typeof rankLevel === "string" ? rankLevel : concept.rankLevel,
      rankName: typeof rankName === "string" ? rankName : concept.rankName,
    }
    detailResult = await nextResult(detailResult, rankUpdate, updateConceptRank)
  }

  return detailResult
}

export default detailUpdates
