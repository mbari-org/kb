import { updateConceptParent } from '@/lib/services/oni/api/concept'

const structureUpdates = async (updates, result, nextResult) => {
  const { parent } = updates
  // const { concept } = result

  let structureResult = { ...result }

  if (parent) {
    structureResult = await nextResult(result, { parent }, updateConceptParent)
  }

  return structureResult
}

export default structureUpdates
