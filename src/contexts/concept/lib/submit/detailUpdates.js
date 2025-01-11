import { isEmpty, prune } from "@/lib/kb/util"

import { updateAuthor, updateMedia, updateRank } from "../update"

// Updates are transactional; the original concept is returned if any error occurs.
const detailUpdates = async params => {
  const { concept, config, updates, validation } = params

  const { author, media, rankLevel, rankName } = updates

  const nextResult = detailProcessor(concept, config)

  let result = { error: null, concept: { ...concept } }

  if (author && validation.author === true) {
    result = await nextResult(result, { author }, updateAuthor)
  }

  if (media && validation.media === true) {
    result = await nextResult(result, { media }, updateMedia)
  }

  if (rankLevel && validation.rankLevel === true) {
    result = await nextResult(result, { rankLevel }, updateRank)
  }

  if (rankName && validation.rankName === true) {
    result = await nextResult(result, { rankName }, updateRank)
  }

  return result
}

const detailProcessor =
  (concept, config) => async (result, conceptUpdates, updateFn) => {
    if (result.error)
      return {
        error: result.error,
        concept,
      }

    const updates = prune(conceptUpdates)
    if (isEmpty(updates)) {
      return { concept }
    }

    const { error, _payload } = await updateFn(config, concept.name, updates)
    const updatedConcept = { ...concept, ...updates }

    return { error, updatedConcept }
  }

export default detailUpdates
