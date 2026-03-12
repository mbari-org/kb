import { renameToConceptAssociations } from '@/lib/api/associations'
import { renameConceptObservations } from '@/lib/api/observations'
import { removeConcept } from '@/lib/api/references'
import { createConceptTemplate, renameToConceptTemplates } from '@/lib/api/templates'

import { RELATED_DATA_COUNTS } from '@/components/kb/panels/concepts/concept/change/staged/name/relatedDataCounts'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

import { PANEL_DATA } from '@/lib/constants/panelData.js'
import { PREFS } from '@/lib/constants/prefs.js'

import { EMPTY_FILTERS } from '@/lib/concept/state/templates'

const { KEY } = PREFS.USER
const { ANNOTATIONS, ASSOCIATIONS, REALIZATIONS, REFERENCES, TEMPLATES_DEFINED, TEMPLATES_TO } = RELATED_DATA_COUNTS

const performConceptPrefsUpdate = async deleteConceptContext => {
  const { concept, getPreferences } = deleteConceptContext
  const conceptPrefs = await getPreferences(KEY.CONCEPTS)
  const removalsAtOrBeforePosition = conceptPrefs.state
    .slice(0, conceptPrefs.position + 1)
    .filter(name => name === concept.name).length
  const updatedPrefsState = conceptPrefs.state.filter(name => name !== concept.name)
  let updatedPosition = conceptPrefs.position - removalsAtOrBeforePosition
  if (updatedPrefsState.length === 0) {
    updatedPosition = -1
  } else if (updatedPosition < 0) {
    updatedPosition = 0
  } else if (updatedPosition >= updatedPrefsState.length) {
    updatedPosition = updatedPrefsState.length - 1
  }
  const updatedConceptPrefs = { state: updatedPrefsState, position: updatedPosition }
  return deleteConceptContext.savePreferences(KEY.CONCEPTS, updatedConceptPrefs)
}

const performSettingsUpdate = deleteConceptContext => {
  const { settings } = deleteConceptContext
  const templatesSettings = settings.templates || {}

  const updatedSettings = {
    ...settings,
    templates: {
      ...templatesSettings,
      byAvailable: false,
      filters: {
        ...templatesSettings.filters,
        ...EMPTY_FILTERS,
      },
    },
  }

  return deleteConceptContext.savePreferences(KEY.SETTINGS, updatedSettings)
}

const preSideEffects = async deleteConceptContext => {
  const { apiFns, concept, reassign, relatedDataCounts, templates } = deleteConceptContext
  const oldNewPayload = { old: concept.name, new: reassign }

  const promises = {}

  relatedDataCounts.forEach(count => {
    if (count.value > 0) {
      switch (count.title) {
        case ASSOCIATIONS:
          promises[ASSOCIATIONS] = apiFns.apiPayload(renameToConceptAssociations, [concept.name, reassign])
          break

        case ANNOTATIONS:
          promises[ANNOTATIONS] = apiFns.apiPayload(renameConceptObservations, oldNewPayload)
          break

        case REALIZATIONS:
          break

        case REFERENCES:
          promises[REFERENCES] = Promise.all(
            concept.references.map(reference => apiFns.apiPayload(removeConcept, [reference.id, concept.name]))
          )
          break

        case TEMPLATES_DEFINED: {
          const definedTemplates = filterTemplates(templates, { concepts: [concept.name] })
          const templatePromises = definedTemplates.map(template => {
            const { linkName, linkValue, toConcept } = template
            const newTemplate = {
              concept: reassign,
              linkName,
              linkValue,
              toConcept: toConcept || reassign,
            }
            return apiFns.apiPayload(createConceptTemplate, newTemplate)
          })
          promises[TEMPLATES_DEFINED] = Promise.all(templatePromises)
          break
        }

        case TEMPLATES_TO:
          promises[TEMPLATES_TO] = apiFns.apiPayload(renameToConceptTemplates, oldNewPayload)
          break
      }
    }
  })

  const apiResults = await Promise.all(
    Object.entries(promises).map(([key, promise]) => promise.then(value => [key, value]))
  )
  return Object.fromEntries(apiResults)
}

const postSideEffects = async deleteConceptContext => {
  const { refreshPanelData: refreshPanelDataFn } = deleteConceptContext

  await performConceptPrefsUpdate(deleteConceptContext)
  await performSettingsUpdate(deleteConceptContext)
  await refreshPanelDataFn(PANEL_DATA.REFERENCES)
  return {}
}

const applyResults = async (refreshPanelDataFn, results) => {
  await Promise.all(
    Object.entries(results).map(async ([key, value]) => {
      switch (key) {
        case ASSOCIATIONS:
          // no-op
          break

        case ANNOTATIONS:
          // no-op
          break

        case REALIZATIONS:
          // no-op
          break

        case REFERENCES:
          // no-op
          break

        case TEMPLATES_DEFINED:
        case TEMPLATES_TO:
          if (value.length > 0) {
            await refreshPanelDataFn(PANEL_DATA.TEMPLATES)
          }
          break
      }
    })
  )
}

export { applyResults, postSideEffects, preSideEffects }
