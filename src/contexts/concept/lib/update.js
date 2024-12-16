import {
  updateConceptAuthor,
  updateConceptName,
  updateConceptRank,
} from "@/lib/services/oni/api/concept"

const updateAuthor = updateConceptAuthor

const updateRank = updateConceptRank

const updateMedia = async (_config, conceptName, media) => {
  console.log(`Updating media for concept ${conceptName} with:`, media)
  return null
  // return { concept }
}

const updateName = async (config, conceptName, updates) => {
  console.log(`Updating name for concept ${conceptName} with:`, updates.name)

  return updateConceptName(config, conceptName, { newName: updates.name })
}

export { updateAuthor, updateMedia, updateName, updateRank }
