import { CONCEPT_FIELD, PREFS } from '@/lib/constants'

const getNameUpdate = updatesInfo => {
  const updated = updatesInfo?.updatedValue(CONCEPT_FIELD.NAME)
  return {
    value: updated?.value,
    extent: updated?.extent,
    associatedCounts: updated?.associatedCounts,
    reassignTo: updated?.reassignTo,
  }
}

const updateConceptPrefsName = async (updatesContext, updatesInfo) => {
  const { getPreferences, savePreferences, staleConcept } = updatesContext
  const { value: updatedName } = getNameUpdate(updatesInfo)
  const staleName = staleConcept.name

  const conceptPrefs = await getPreferences(PREFS.KEYS.CONCEPTS)
  const updatedPrefsState = conceptPrefs.state.map(name => name === staleName ? updatedName : name)
  const updatedConceptPrefs = { state: updatedPrefsState, position: conceptPrefs.position }
  await savePreferences(PREFS.KEYS.CONCEPTS, updatedConceptPrefs)
}

const performReassignments = async (conceptName, reassignTo, associatedCounts) => {
  const reassignmentPromises = associatedCounts
    .filter(count => count.value > 0 && count.renameFn)
    .map(count => count.renameFn({ old: conceptName, new: reassignTo }))

  return Promise.all(reassignmentPromises)
}

const applyRenameSideEffects = async (updatesContext, updatesInfo) => {
  if (updatesInfo?.hasUpdated(CONCEPT_FIELD.NAME)) {
    const { reassignTo, associatedCounts } = getNameUpdate(updatesInfo)
    await performReassignments(
      updatesContext.staleConcept.name,
      reassignTo,
      associatedCounts)

    const { refreshPanelData } = updatesContext
    await updateConceptPrefsName(updatesContext, updatesInfo)
    await refreshPanelData('references')
  }
}

export default applyRenameSideEffects
