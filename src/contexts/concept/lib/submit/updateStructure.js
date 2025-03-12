import { updatedFields } from '@/lib/util'

const updateStructure = (concept, updates, submit) => {
  const structureUpdates = updatedFields(updates, ['parent'])

  if (!structureUpdates) {
    return []
  }

  return []

  // const { parent } = structureUpdates
  // // const { concept } = result

  // let structureResult = { ...result }

  // if (parent) {
  //   structureResult = await process(updateConceptParent, { parent }, structureResult)
  // }

  // return structureResult
}

export default updateStructure
