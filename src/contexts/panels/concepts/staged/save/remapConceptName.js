import { PANEL_DATA } from '@/lib/constants/panelData.js'
import { PREFS } from '@/lib/constants/prefs.js'

const { KEY } = PREFS.USER

const conceptPrefsUpdate = async (updatesContext, newConceptName) => {
  const { getPreferences, staleConcept } = updatesContext
  const staleName = staleConcept.name

  const conceptPrefs = await getPreferences(KEY.CONCEPTS)
  const updatedPrefsState = conceptPrefs.state.map(name => (name === staleName ? newConceptName : name))
  return { state: updatedPrefsState, position: conceptPrefs.position }
}

const settingsUpdate = (updatesContext, staleName, newConceptName) => {
  const { settings: currentSettings } = updatesContext
  const remap = value => (value === staleName ? newConceptName : value)

  const updatedSettings = {
    ...currentSettings,
    references: {
      ...currentSettings.references,
      filters: {
        ...currentSettings.references?.filters,
        concept: remap(currentSettings.references?.filters?.concept),
        concepts: remap(currentSettings.references?.filters?.concepts),
      },
    },
    templates: {
      ...currentSettings.templates,
      filters: {
        ...currentSettings.templates?.filters,
        concept: remap(currentSettings.templates?.filters?.concept),
        toConcept: remap(currentSettings.templates?.filters?.toConcept),
      },
    },
    realizations: {
      ...currentSettings.realizations,
      filters: {
        ...currentSettings.realizations?.filters,
        concept: remap(currentSettings.realizations?.filters?.concept),
        toConcept: remap(currentSettings.realizations?.filters?.toConcept),
      },
    },
  }
  return updatedSettings
}

const remapConceptName = async (updatesContext, newConceptName) => {
  const {
    refreshPanelData,
    renameConceptRealizations,
    renameRealizationToConceptNames,
    savePreferences,
    updatePreferences,
  } = updatesContext
  const staleName = updatesContext.staleConcept.name

  renameConceptRealizations(staleName, newConceptName)
  renameRealizationToConceptNames(staleName, newConceptName)

  const updatedConceptPrefs = await conceptPrefsUpdate(updatesContext, newConceptName)
  const updatedSettings = settingsUpdate(updatesContext, staleName, newConceptName)

  await Promise.all([
    updatePreferences(KEY.CONCEPTS, updatedConceptPrefs),
    savePreferences(KEY.SETTINGS, updatedSettings),

    refreshPanelData(PANEL_DATA.REFERENCES),
    refreshPanelData(PANEL_DATA.TEMPLATES),
  ])
}

export default remapConceptName
