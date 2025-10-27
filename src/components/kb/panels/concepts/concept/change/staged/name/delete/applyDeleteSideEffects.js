
import { PREFS } from '@/lib/constants'

// const performReassignments = async deleteConceptContext => {
//   const { apiFns, concept, associatedCounts, reassignTo } = deleteConceptContext
//   const reassignmentPromises = ASSOCIATION_INFO.reduce((acc, association) => {
//     if (association.renamedFn && associatedCounts[association.title] > 0) {
//       acc.push(apiFns.apiPayload(association.renamedFn, { old: concept.name, new: reassignTo }))
//     }
//     return acc
//   }, [])
//   return Promise.all(reassignmentPromises)
// }

const removeConceptPrefsName = async deleteConceptContext => {
  const { getPreferences, savePreferences, concept } = deleteConceptContext
  const conceptPrefs = await getPreferences(PREFS.KEYS.CONCEPTS)
  const removalsBeforePosition = conceptPrefs.state
    .slice(0, conceptPrefs.position)
    .filter(name => name === concept.name).length
  const updatedPrefsState = conceptPrefs.state.filter(name => name !== concept.name)
  const updatedPosition = conceptPrefs.position - removalsBeforePosition
  const updatedConceptPrefs = { state: updatedPrefsState, position: updatedPosition }
  await savePreferences(PREFS.KEYS.CONCEPTS, updatedConceptPrefs)
}

const applyDeleteSideEffects = async deleteConceptContext => {
  // await performReassignments(deleteConceptContext)
  await removeConceptPrefsName(deleteConceptContext)
  await deleteConceptContext.refreshPanelData('references')
}

export default applyDeleteSideEffects
