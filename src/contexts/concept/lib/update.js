import {
  updateConceptAuthor,
  updateConceptRank,
} from "@/lib/services/oni/api/concept"
import { fetchLinkTemplates } from "@/lib/services/oni/api/linkTemplates"

const updateAuthor = updateConceptAuthor
const updateRank = updateConceptRank

const updateMedia = async (concept, media, _config) => {
  console.log(`Updating media for concept ${concept.name} with:`, media)
  return { concept }
}

const updateName = async (concept, name, config) => {
  const { error: linkTemplatesError, payload: linkTemplates } =
    await fetchLinkTemplates(concept.name, config)

  if (linkTemplatesError) {
    return { error: linkTemplatesError }
  }

  if (0 < concept.linkRealizations.length || 0 < linkTemplates.length) {
    console.log(`Concept ${concept.name} has realizations or templates`)
  }

  console.log(`Updating name for concept ${concept.name} with:`, name)
  return { concept }
}

export { updateAuthor, updateMedia, updateName, updateRank }
