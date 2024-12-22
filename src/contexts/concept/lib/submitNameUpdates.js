import { updateConceptName } from "@/lib/services/oni/api/concept"

const UPDATE_ALL_DATA = "all"
const UPDATE_NAME_ONLY = "solo"

const submitNameUpdates = async params => {
  const { concept, config, extent, updates } = params

  if (extent === UPDATE_NAME_ONLY) {
    return submitNameUpdate(config, concept.name, { newName: updates.name })
  }
  return null
}

const submitNameUpdate = async (config, conceptName, updates) =>
  updateConceptName(config, conceptName, updates)

// const nextResult = (concept, config) => async (result, updates, updateFn) => {
//   if (result.error)
//     return {
//       error: result.error,
//       concept,
//     }

//   const { error, _payload } = await updateFn(config, concept.name, updates)
//   const updatedConcept = { ...concept, ...updates }

//   return { error, updatedConcept }
// }

export { submitNameUpdates, UPDATE_ALL_DATA, UPDATE_NAME_ONLY }
