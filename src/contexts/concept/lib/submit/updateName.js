import { prunePick } from '@/lib/util'

const updateName = (_concept, updates, _submit) => {
  const { name } = prunePick(updates, ['name'])
  if (!name) {
    return []
  }

  return []

  // let nameResult = { ...result }

  // const { name } = nameUpdates

  // nameResult = await process(updateConceptName, { newName: name }, nameResult)

  // return nameResult

  // if (updates.nameChange === NAME_UPDATE.NAME_ONLY || error) {
  //   return { error, updatedName: updates.name }
  // }

  // return updateConceptData(concept)
}

// const updateConceptData = async ({ _config, concept, _updates }) => {
//   return { error: `CxTBD: Update ${concept.name} data` }
// }

export default updateName
