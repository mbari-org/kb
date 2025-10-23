import { changeConcept } from '@/lib/kb/api/references'

import { CONCEPT_FIELD, CONCEPT_NAME_EXTENT, PREFS } from '@/lib/constants'

const { ASSOCIATED_DATA } = CONCEPT_NAME_EXTENT

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
    await updateConceptPrefsName(updatesContext, updatesInfo)
    await updateReferences(updatesContext, updatesInfo)
  }
  if (updatesInfo?.hasUpdated(CONCEPT_FIELD.DELETE)) {
    const { initial: wasDeleted, staged: isDeleted } = updatesInfo.updatedValue(CONCEPT_FIELD.DELETE) || {}
    if (!wasDeleted && isDeleted) {
      await removeConceptPrefsName(updatesContext, updatesContext.staleConcept.name)
    }
  }
}

export default applySideEffects
