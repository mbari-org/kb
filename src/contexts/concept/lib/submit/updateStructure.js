import { updateConceptParent } from '@/lib/services/oni/api/concept'

import { updatedFields } from '@/lib/util'

const updateStructure = async (updates, result, process) => {
  const structureUpdates = updatedFields(updates, ['parent'])

  if (!structureUpdates) {
    return result
  }

  const { parent } = structureUpdates
  // const { concept } = result

  let structureResult = { ...result }

  if (parent) {
    structureResult = await process(updateConceptParent, { parent }, structureResult)
  }

  return structureResult
}

export default updateStructure
