import {
  updateConceptAuthor,
  updateConceptRankLevel,
} from "@/lib/services/oni/api/concept"
import { isEmpty, prune } from "@/lib/util"

// Updates are effectively transactional. The original concept is returned if any error occurs.
const processUpdates = async (concept, updates, taxonomy) => {
  const { author, rankLevel, name, media, rankName } = updates

  const nextResult = submitUpdate(concept, taxonomy.config)

  let result = { error: null, concept: { ...concept } }

  result = await nextResult(result, updateConceptAuthor, { author })

  result = await nextResult(result, updateConceptRankLevel, {
    rankLevel,
    rankName,
  })

  result = await nextResult(result, updateName, { name })

  result = await nextResult(result, updateMedia, { media })

  return result
}

const updateMedia = async (concept, media, _config) => {
  console.log(`Updating media for concept ${concept.name} with:`, media)
  return { concept }
}

const updateName = async (concept, name, _config) => {
  console.log(`Updating name for concept ${concept.name} with:`, name)
  return { concept }
}

const submitUpdate =
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

export { processUpdates }
