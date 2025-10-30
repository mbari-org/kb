import { PANEL_DATA, PREFS } from '@/lib/constants'

const conceptPrefsUpdate = async deleteConceptContext => {
  const { getPreferences, concept } = deleteConceptContext
  const conceptPrefs = await getPreferences(PREFS.KEYS.CONCEPTS)
  const removalsBeforePosition = conceptPrefs.state
    .slice(0, conceptPrefs.position)
    .filter(name => name === concept.name).length
  const updatedPrefsState = conceptPrefs.state.filter(name => name !== concept.name)
  const updatedPosition = conceptPrefs.position - removalsBeforePosition
  const updatedConceptPrefs = { state: updatedPrefsState, position: updatedPosition }
  return updatedConceptPrefs
}

const settingsUpdate = deleteConceptContext => {
  deleteConceptContext.setClearTemplateFilters(true)

  const { getSettings } = deleteConceptContext
  const currentSettings = getSettings(PREFS.KEYS.SETTINGS) || {}
  const updatedSettings = {
    ...currentSettings,
    templates: {
      ...currentSettings.templates,
      filters: {},
    },
  }
  return updatedSettings
}

const applyDeleteSideEffects = async deleteConceptContext => {
  const { savePreferences, refreshPanelData } = deleteConceptContext

  const updatedConceptPrefs = await conceptPrefsUpdate(deleteConceptContext)
  const updatedSettings = settingsUpdate(deleteConceptContext)

  await savePreferences(PREFS.KEYS.CONCEPTS, updatedConceptPrefs)
  await savePreferences(PREFS.KEYS.SETTINGS, updatedSettings)

  await refreshPanelData(PANEL_DATA.KEYS.REFERENCES)
}

export default applyDeleteSideEffects
