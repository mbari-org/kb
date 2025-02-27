import { updateConceptName } from '@/lib/services/oni/api/concept'

import { NAME_UPDATE } from '@/lib/kb/concept/state/structure'

const nameUpdates = async ({ config, concept, updates }) => {
  const { error } = await updateConceptName(config, concept.name, {
    newName: updates.name,
  })

  if (updates.nameUpdate === NAME_UPDATE.NAME_ONLY || error) {
    return { error, updatedName: updates.name }
  }

  return updateConceptData(concept)
}

const updateConceptData = async ({ _config, concept, _updates }) => {
  return { error: `CxTBD: Update ${concept.name} data` }
}

export default nameUpdates
