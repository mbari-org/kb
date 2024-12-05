import { isEmpty, prune } from "@/lib/util"

import {
  updateAuthor,
  updateMedia,
  updateName,
  updateRankLevel,
} from "./update"

// Updates are transactional, wtih the original concept is returned if any error occurs.
const submitUpdates = async (concept, updates, config) => {
  const { author, rankLevel, name, media, rankName } = updates

  const nextResult = updateSubmitter(concept, config)

  let result = { error: null, concept: { ...concept } }

  result = await nextResult(result, updateAuthor, { author })
  result = await nextResult(result, updateName, { name })
  result = await nextResult(result, updateMedia, { media })
  result = await nextResult(result, updateRankLevel, {
    rankLevel,
    rankName,
  })

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
