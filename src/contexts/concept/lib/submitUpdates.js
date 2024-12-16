import { isEmpty, prune } from "@/lib/util"

import { updateAuthor, updateMedia, updateName, updateRank } from "./update"

// Updates are transactional, wtih the original concept is returned if any error occurs.
const submitUpdates = async params => {
  const { concept, config, updates, validation } = params

  const { author, name, media, rankLevel, rankName } = updates

  const nextResult = updateSubmitter(concept, config)

  let result = { error: null, concept: { ...concept } }

  if (validation.author === true) {
    result = await nextResult(result, updateAuthor, { author })
  }

  if (validation.name === "solo" || validation.name === "all") {
    result = await nextResult(result, updateName, { name })
  }

  if (validation.media === true) {
    result = await nextResult(result, updateMedia, { media })
  }

  if (validation.rankLevel === true) {
    result = await nextResult(result, updateRank, { rankLevel })
  }

  if (validation.rankName === true) {
    result = await nextResult(result, updateRank, { rankName })
  }

  return result
}

const updateSubmitter =
  (concept, config) => async (result, updateFn, conceptUpdates) => {
    if (result.error)
      return {
        error: result.error,
        concept,
      }

    const updates = prune(conceptUpdates)
    if (isEmpty(updates)) {
      return { concept }
    }

    const { error, _payload } = await updateFn(concept.name, updates, config)
    const updatedConcept = { ...concept, ...updates }

    return { error, updatedConcept }
  }

export { submitUpdates }
