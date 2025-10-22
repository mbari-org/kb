import { changeConcept } from '@/lib/kb/api/references'

import { CONCEPT_NAME_EXTENT, PREFS } from '@/lib/constants'

const { ASSOCIATED_DATA } = CONCEPT_NAME_EXTENT

const updateConceptPrefs = async (updatesContext, updatesInfo) => {
  const { getPreferences, savePreferences, staleConcept } = updatesContext
  const { value: updatedName } = updatedNameInfo(updatesInfo)
  const staleName = staleConcept.name

  const conceptPrefs = await getPreferences(PREFS.KEYS.CONCEPTS)
  const updatedPrefsState = conceptPrefs.state.map(name => name === staleName ? updatedName : name)
  const updatedConceptPrefs = { state: updatedPrefsState, position: conceptPrefs.position }
  await savePreferences(PREFS.KEYS.CONCEPTS, updatedConceptPrefs)
}
const updatedNameInfo = updatesInfo => {
  const updated = updatesInfo?.updatedValue('name')
  return { value: updated?.value, extent: updated?.extent }
}

const updateReferences = async (updatesContext, updatesInfo) => {
  const { value: updatedName, extent: updatedNameExtent } = updatedNameInfo(updatesInfo)
  if (updatedNameExtent === ASSOCIATED_DATA) {
    const { apiFns, getReferences, refreshPanelData, staleConcept } = updatesContext
    const staleName = staleConcept.name
    const references = getReferences(staleName)
    await Promise.all(
      references.map(reference => apiFns.apiPayload(changeConcept, [reference.id, staleName, updatedName]))
    )
    await refreshPanelData('references')
  }
}

const applySideEffects = async (updatesContext, updatesInfo) => {
  if (updatesInfo?.hasUpdated('name')) {
    await updateConceptPrefs(updatesContext, updatesInfo)
    await updateReferences(updatesContext, updatesInfo)
  }
}

export default applySideEffects