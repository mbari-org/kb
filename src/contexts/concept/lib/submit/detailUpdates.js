import { isEmpty, prune } from "@/lib/kb/util"

import { updateAuthor, updateMedia, updateRank } from "../update"

// Updates are transactional; the original concept is returned if any error occurs.
const detailUpdates = async params => {
  const { concept, config, updates } = params

  // const { author, media, rankLevel, rankName } = updates
  const { author, media, rankLevel, rankName } = updates

  const nextResult = detailProcessor(concept, config)

  let result = { error: null, concept: { ...concept } }

  if (author) {
    result = await nextResult(result, { author }, updateAuthor)
  }

  if (media) {
    result = await nextResult(result, { media }, updateMedia)
  }

  // Rank name and level must both be sent, even if only one changes.
  if (typeof rankLevel === "string" || typeof rankName === "string") {
    const rankUpdate = {
      rankLevel: typeof rankLevel === "string" ? rankLevel : concept.rankLevel,
      rankName: typeof rankName === "string" ? rankName : concept.rankName,
    }
    result = await nextResult(result, rankUpdate, updateRank)
  }

  return result
}

const detailProcessor =
  (concept, config) => async (result, modifyConcepts, updateFn) => {
    if (result.error)
      return {
        error: result.error,
        concept,
      }

    const updates = prune(modifyConcepts)
    if (isEmpty(updates)) {
      return { concept }
    }

    const { error, _payload } = await updateFn(config, concept.name, updates)
    const updatedConcept = { ...concept, ...updates }

    return { error, updatedConcept }
  }

export default detailUpdates
