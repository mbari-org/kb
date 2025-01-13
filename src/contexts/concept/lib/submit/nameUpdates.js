import { updateConceptName } from "@/lib/services/oni/api/concept"
import { UPDATE_NAME_ONLY } from "../useSubmitUpdates"

const nameUpdates = async ({ config, concept, extent, updates }) => {
  const { error } = await updateConceptName(config, concept.name, {
    newName: updates.name,
  })

  if (extent === UPDATE_NAME_ONLY || error) {
    return { error, updatedName: updates.name }
  }

  return updateConceptData(concept)
}

const updateConceptData = async ({ _config, concept, _updates }) => {
  return { error: `CxTBD: Update ${concept.name} data` }
}

export default nameUpdates
