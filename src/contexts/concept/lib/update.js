import {
  updateConceptAuthor,
  updateConceptName,
  updateConceptRank,
} from "@/lib/services/oni/api/concept"

const updateAuthor = updateConceptAuthor

const updateMedia = async (_config, conceptName, media) => {
  console.log(`Updating media for concept ${conceptName} with:`, media)
  return null
  // return { concept }
}

const updateName = async (config, conceptName, updates) => {
  return updateConceptName(config, conceptName, { newName: updates.name })
}

const updateRank = updateConceptRank

export { updateAuthor, updateMedia, updateName, updateRank }
