import { ASSOCIATION_INFO } from '@/components/kb/panels/concepts/concept/change/staged/name/associatedCountsData'
import { CONCEPT_FIELD, PREFS } from '@/lib/constants'

const performReassignments = async (apiFns, conceptName, reassignTo, associatedCounts) => {
  const reassignmentPromises = ASSOCIATION_INFO.reduce((acc, association) => {
    if (association.renamedFn && associatedCounts[association.title] > 0) {
      acc.push(apiFns.apiPayload(association.renamedFn, { old: conceptName, new: reassignTo }))
    }
    return acc
  }, [])
  return Promise.all(reassignmentPromises)
}

const updateConceptPrefsName = async (updatesContext, updatesInfo) => {
  const { getPreferences, savePreferences, staleConcept } = updatesContext
  const { value: updatedName } = updatedNameInfo(updatesInfo)
  const staleName = staleConcept.name

  const conceptPrefs = await getPreferences(PREFS.KEYS.CONCEPTS)
  const updatedPrefsState = conceptPrefs.state.map(name => name === staleName ? updatedName : name)
  const updatedConceptPrefs = { state: updatedPrefsState, position: conceptPrefs.position }
  await savePreferences(PREFS.KEYS.CONCEPTS, updatedConceptPrefs)
}

const updatedNameInfo = updatesInfo => {
  const updated = updatesInfo?.updatedValue(CONCEPT_FIELD.NAME)
  return { value: updated?.value, extent: updated?.extent }
}

export { performReassignments }

const applyRenameSideEffects = async (updatesContext, updatesInfo) => {
  if (updatesInfo?.hasUpdated(CONCEPT_FIELD.NAME)) {
    // await performReassignments(
    //   updatesContext.apiFns,
    //   updatesContext.staleConcept.name,
    //   updatesInfo.reassignTo,
    //   updatesInfo.associatedCounts)

    const { refreshPanelData } = updatesContext
    await updateConceptPrefsName(updatesContext, updatesInfo)
    await refreshPanelData('references')
  }
}

export default applyRenameSideEffects
