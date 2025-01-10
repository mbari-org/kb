import { updateConceptName } from "@/lib/services/oni/api/concept"

const nameUpdates = async (params, UPDATE_NAME_ONLY) => {
  const { error } = await nameUpdate(params)

  if (params.extent === UPDATE_NAME_ONLY || error) {
    return { error, updatedName: params.updates.name }
  }

  return processConceptDataUpdate(params)
}

const nameUpdate = async ({ config, concept, updates }) =>
  updateConceptName(config, concept.name, { newName: updates.name })

const processConceptDataUpdate = async ({ _config, concept, _updates }) => {
  return { error: `CxTBD: Update ${concept.name} data` }
}

export default nameUpdates
