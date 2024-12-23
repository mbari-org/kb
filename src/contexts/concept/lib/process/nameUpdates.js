import { updateConceptName } from "@/lib/services/oni/api/concept"

const UPDATE_ALL_DATA = "all"
const UPDATE_NAME_ONLY = "solo"

const processNameUpdates = async params => {
  const { error, payload: updatedConcept } = await processNameUpdate(params)

  if (params.extent === UPDATE_NAME_ONLY || error) {
    return { error, updatedConcept }
  }

  return processConceptDataUpdate(params)
}

const processNameUpdate = async ({ config, concept, updates }) =>
  updateConceptName(config, concept.name, { newName: updates.name })

const processConceptDataUpdate = async ({ config, concept, updates }) => {
  return { error: `CxTBD: Update ${concept.name} data` }
}

export { processNameUpdates, UPDATE_ALL_DATA, UPDATE_NAME_ONLY }
