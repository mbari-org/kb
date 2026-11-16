import { performReassignments } from '@/components/kb/panels/concepts/concept/change/staged/name/relatedDataCounts'

import { CONCEPT } from '@/lib/constants'
import { PANEL_DATA } from '@/lib/constants/panelData.js'
import { PREFS } from '@/lib/constants/prefs.js'

import CONFIG from '@/lib/config'

const { KEY } = PREFS.USER
const { REASSIGN } = CONFIG.CONCEPT.CHANGE_NAME

const getNameUpdate = updatesInfo => {
  const updated = updatesInfo.updatedValue(CONCEPT.FIELD.NAME)
  return {
    value: updated.value,
    extent: updated.extent,
    relatedDataCounts: updated.relatedDataCounts,
  }
}

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

const applyRenameSideEffects = async (updatesContext, updatesInfo) => {
  const { value: newConceptName, extent, relatedDataCounts } = getNameUpdate(updatesInfo)
  const staleConcept = updatesContext.staleConcept
  const { renameConceptRealizations, renameRealizationToConceptNames, savePreferences, updatePreferences, refreshPanelData } =
    updatesContext

  if (extent === REASSIGN) {
    await performReassignments(staleConcept.name, newConceptName, relatedDataCounts)
  }

  renameConceptRealizations(staleConcept.name, newConceptName)
  renameRealizationToConceptNames(staleConcept.name, newConceptName)

  const updatedConceptPrefs = await conceptPrefsUpdate(updatesContext, newConceptName)
  const updatedSettings = settingsUpdate(updatesContext, staleConcept.name, newConceptName)

  await Promise.all([
    updatePreferences(KEY.CONCEPTS, updatedConceptPrefs),
    savePreferences(KEY.SETTINGS, updatedSettings),

    refreshPanelData(PANEL_DATA.REFERENCES),
    refreshPanelData(PANEL_DATA.TEMPLATES),
  ])
}

export default applyRenameSideEffects
