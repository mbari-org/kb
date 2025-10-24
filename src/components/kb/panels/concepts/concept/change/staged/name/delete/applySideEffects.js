import { performReassignments } from '@/contexts/panels/concepts/staged/save/applySideEffects'
import { PREFS } from '@/lib/constants'

const removeConceptPrefsName = async (updatesContext, deletedConceptName) => {
  const { getPreferences, savePreferences } = updatesContext
  const conceptPrefs = await getPreferences(PREFS.KEYS.CONCEPTS)
  const removalsBeforePosition = conceptPrefs.state
    .slice(0, conceptPrefs.position)
    .filter(name => name === deletedConceptName).length
  const updatedPrefsState = conceptPrefs.state.filter(name => name !== deletedConceptName)
  const updatedPosition = conceptPrefs.position - removalsBeforePosition
  const updatedConceptPrefs = { state: updatedPrefsState, position: updatedPosition }
  await savePreferences(PREFS.KEYS.CONCEPTS, updatedConceptPrefs)
}

const applySideEffects = async (updatesContext, conceptName, reassignmentData) => {
  await removeConceptPrefsName(updatesContext, conceptName)

  if (reassignmentData?.associatedCounts && reassignmentData?.reassignTo) {
    await performReassignments(
      updatesContext.apiFns,
      conceptName,
      reassignmentData.reassignTo,
      reassignmentData.associatedCounts
    )

  }

  const { refreshPanelData } = updatesContext
  await refreshPanelData('references')

  // const { getReferences } = updatesContext
  // const references = getReferences(conceptName)
  // if (references.length > 0) {

  //   await updateConceptReferences(updatesContext, {
  //     conceptName,
  //     updatedName: null,
  //   })
  // }
}

export default applySideEffects