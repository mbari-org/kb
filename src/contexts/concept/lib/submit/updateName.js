import { updateConceptName } from '@/lib/services/oni/api/concept'

import { updatedFields } from '@/lib/util'

const updateName = async (updates, result, process) => {
  const nameUpdates = updatedFields(updates, ['name'])

  if (!nameUpdates) {
    return result
  }

  let nameResult = { ...result }

  const { name } = nameUpdates

  nameResult = await process(updateConceptName, { newName: name }, nameResult)

  return nameResult

  // if (updates.nameUpdate === NAME_UPDATE.NAME_ONLY || error) {
  //   return { error, updatedName: updates.name }
  // }

  // return updateConceptData(concept)
}

// const updateConceptData = async ({ _config, concept, _updates }) => {
//   return { error: `CxTBD: Update ${concept.name} data` }
// }

export default updateName
