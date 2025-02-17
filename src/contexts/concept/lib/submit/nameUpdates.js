import { updateConceptName } from '@/lib/services/oni/api/concept'
// import { UPDATE_NAME_ONLY } from "../useSubmitUpdates"

export const UPDATE = {
  NAME_ONLY: 'Name Only',
  ALL_DATA: 'All Data',
}

const nameUpdates = async ({ config, concept, updates }) => {
  const { error } = await updateConceptName(config, concept.name, {
    newName: updates.name,
  })

  if (updates.nameUpdate === UPDATE.NAME_ONLY || error) {
    return { error, updatedName: updates.name }
  }

  return updateConceptData(concept)
}

const updateConceptData = async ({ _config, concept, _updates }) => {
  return { error: `CxTBD: Update ${concept.name} data` }
}

export default nameUpdates
