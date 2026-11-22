import remapConceptName from '@/contexts/panels/concepts/staged/save/remapConceptName'

import { performReassignments } from '@/components/kb/panels/concepts/concept/change/staged/name/relatedDataCounts'

import { CONCEPT } from '@/lib/constants'

import CONFIG from '@/lib/config'

const { REASSIGN } = CONFIG.CONCEPT.CHANGE_NAME

const getNameUpdate = updatesInfo => {
  const updated = updatesInfo.updatedValue(CONCEPT.FIELD.NAME)
  return {
    value: updated.value,
    extent: updated.extent,
    relatedDataCounts: updated.relatedDataCounts,
  }
}

const applyRenameSideEffects = async (updatesContext, updatesInfo) => {
  const { value: newConceptName, extent, relatedDataCounts } = getNameUpdate(updatesInfo)

  if (extent === REASSIGN) {
    await performReassignments(updatesContext.staleConcept.name, newConceptName, relatedDataCounts)
  }

  await remapConceptName(updatesContext, newConceptName)
}

export default applyRenameSideEffects
