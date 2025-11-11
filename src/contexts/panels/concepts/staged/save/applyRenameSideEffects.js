import { CONCEPT } from '@/lib/constants.js'
import { PANEL_DATA } from '@/lib/constants/panelData.js'
import { PREFS } from '@/lib/constants/prefs.js'

const { KEY } = PREFS.API

const getNameUpdate = updatesInfo => {
  const updated = updatesInfo.updatedValue(CONCEPT.FIELD.NAME)
  return {
    value: updated.value,
    extent: updated.extent,
    relatedDataCounts: updated.relatedDataCounts,
  }
}

const performReassignments = async (conceptName, newConceptName, relatedDataCounts) => {
  const reassignmentPromises = relatedDataCounts
    .filter(count => count.value > 0 && count.reassignFn)
    .map(count => count.reassignFn({ old: conceptName, new: newConceptName }))

  return Promise.all(reassignmentPromises)
}

const conceptPrefsUpdate = async (updatesContext, newConceptName) => {
  const { getPreferences, staleConcept } = updatesContext
  const staleName = staleConcept.name

  const conceptPrefs = await getPreferences(KEY.CONCEPTS)
  const updatedPrefsState = conceptPrefs.state.map(name => name === staleName ? newConceptName : name)
  return { state: updatedPrefsState, position: conceptPrefs.position }
}

const settingsUpdate = (updatesContext, staleName, newConceptName) => {
  const { getSettings } = updatesContext
  const currentSettings = getSettings(KEY.SETTINGS) || {}

  const updatedSettings = {
    ...currentSettings,
    templates: {
      ...currentSettings.templates,
      filters: {
        ...currentSettings.templates?.filters,
        concept:
          currentSettings.templates?.filters?.concept === staleName
            ? newConceptName
            : currentSettings.templates?.filters?.concept,
        toConcept:
          currentSettings.templates?.filters?.toConcept === staleName
            ? newConceptName
            : currentSettings.templates?.filters?.toConcept,
      },
    },
  }
  return updatedSettings
}

const applyRenameSideEffects = async (updatesContext, updatesInfo) => {
  const { value: newConceptName, relatedDataCounts } = getNameUpdate(updatesInfo)
  const staleConcept = updatesContext.staleConcept
  const { savePreferences, refreshPanelData } = updatesContext

  await performReassignments(
    staleConcept.name,
    newConceptName,
    relatedDataCounts)

  const updatedConceptPrefs = await conceptPrefsUpdate(updatesContext, newConceptName)
  const updatedSettings = settingsUpdate(updatesContext, staleConcept.name, newConceptName)

  await Promise.all([
    savePreferences(KEY.CONCEPTS, updatedConceptPrefs),
    savePreferences(KEY.SETTINGS, updatedSettings),
    refreshPanelData(PANEL_DATA.TEMPLATES),
    refreshPanelData(PANEL_DATA.REFERENCES),
  ])
}

export default applyRenameSideEffects
