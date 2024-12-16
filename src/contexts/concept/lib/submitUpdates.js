import { isEmpty, prune } from "@/lib/util"

import { updateAuthor, updateMedia, updateName, updateRank } from "./update"

// Updates are transactional, wtih the original concept is returned if any error occurs.
const submitUpdates = async params => {
  const { concept, config, updates, validation } = params

  const { author, name, media, rankLevel, rankName } = updates

  const nextResult = updateSubmitter(concept, config)

  let result = { error: null, concept: { ...concept } }

  if (author && validation.author === true) {
    result = await nextResult(result, { author }, updateAuthor)
  }

  if (name && validation.name === "solo") {
    result = await nextResult(result, { name }, updateName)
  }

  if (name && validation.name === "all") {
    result = await nextResult(result, { name }, updateName)
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

const updateSubmitter =
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

export { submitUpdates }
