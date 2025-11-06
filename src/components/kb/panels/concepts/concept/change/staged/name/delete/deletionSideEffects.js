import { renameToConceptAssociations } from '@/lib/kb/api/associations'
import { renameConceptObservations } from '@/lib/kb/api/observations'
import { createRealization } from '@/lib/kb/api/realizations'
import { addConcept } from '@/lib/kb/api/references'
import { createConceptTemplate, renameToConceptTemplates } from '@/lib/kb/api/templates'

import { RELATED_DATA_COUNTS } from '../relatedDataCounts'

import { pickRealization } from '@/lib/kb/model/realization'
import { pickReference } from '@/lib/kb/model/reference'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

import { PANEL_DATA, PREFS } from '@/lib/constants'

const { ANNOTATIONS, ASSOCIATIONS, REALIZATIONS, REFERENCES, TEMPLATES_DEFINED, TEMPLATES_TO } = RELATED_DATA_COUNTS

const performConceptPrefsUpdate = async deleteConceptContext => {
  const { concept, getPreferences } = deleteConceptContext
  const conceptPrefs = await getPreferences(PREFS.KEYS.CONCEPTS)
  const removalsBeforePosition = conceptPrefs.state
    .slice(0, conceptPrefs.position)
    .filter(name => name === concept.name).length
  const updatedPrefsState = conceptPrefs.state.filter(name => name !== concept.name)
  const updatedPosition = conceptPrefs.position - removalsBeforePosition
  const updatedConceptPrefs = { state: updatedPrefsState, position: updatedPosition }
  return deleteConceptContext.savePreferences(PREFS.KEYS.CONCEPTS, updatedConceptPrefs)
}

const performSettingsUpdate = deleteConceptContext => {
  const { getSettings } = deleteConceptContext
  const currentSettings = getSettings(PREFS.KEYS.SETTINGS) || {}
  const updatedSettings = {
    ...currentSettings,
    templates: {
      ...currentSettings.templates,
      filters: {},
    },
  }
  return deleteConceptContext.savePreferences(PREFS.KEYS.SETTINGS, updatedSettings)
}

const preSideEffects = async deleteConceptContext => {
  const { apiFns, concept, reassign, relatedDataCounts, templates } = deleteConceptContext
  const oldNewPayload = { old: concept.name, new: reassign }

  const promises = {}

  relatedDataCounts.forEach(count => {
    if (count.value > 0) {
      switch (count.title) {
        case ASSOCIATIONS:
          promises[ASSOCIATIONS] = apiFns.apiPayload(
            renameToConceptAssociations,
            [concept.name, reassign]
          )
          break

        case ANNOTATIONS:
          promises[ANNOTATIONS] = apiFns.apiPayload(
            renameConceptObservations,
            oldNewPayload
          )
          break

        case REALIZATIONS:
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
          promises[TEMPLATES_TO] = apiFns.apiPayload(
            renameToConceptTemplates,
            oldNewPayload
          )
          break

        case REFERENCES:
          break
      }
    }
  })

  const apiResults = await Promise.all(
    Object.entries(promises).map(([key, promise]) =>
      promise.then(value => [key, value])
    )
  )
  return Object.fromEntries(apiResults)
}

const postSideEffects = async deleteConceptContext => {
  const { apiFns, concept, reassign, refreshPanelData: refreshPanelDataFn } = deleteConceptContext

  await performConceptPrefsUpdate(deleteConceptContext)
  await performSettingsUpdate(deleteConceptContext)

  const promises = {
    [REALIZATIONS]: Promise.all(
      concept.realizations.map(realization => {
        const { linkName, linkValue, toConcept } = realization
        const reassignedRealization = {
          concept: reassign,
          linkName,
          toConcept,
          linkValue,
        }
        return apiFns.apiPayload(createRealization, reassignedRealization)
      })
    ),
    [REFERENCES]: Promise.all(
      concept.references.map(reference =>
        apiFns.apiPayload(addConcept, [reference.id, reassign])
      )
    ),
  }

  await refreshPanelDataFn(PANEL_DATA.KEYS.REFERENCES)

  const results = await Promise.all(
    Object.entries(promises).map(([key, promise]) =>
      promise.then(value => [key, value])
    )
  )

  return Object.fromEntries(results)
}

const applyResults = async (reassignedConcept, refreshPanelDataFn, results) => {
  await Promise.all(
    Object.entries(results).map(async ([key, value]) => {
      switch (key) {
        case ASSOCIATIONS:
          // CxTBD
          break

        case ANNOTATIONS:
          // no-op
          break

        case REALIZATIONS: {
          if (value.length > 0) {
            const realizations = [...reassignedConcept.realizations]
            value.forEach(result => {
              const realization = pickRealization(result)
              realizations.push(realization)
            })
            reassignedConcept.realizations = realizations

            await refreshPanelDataFn(PANEL_DATA.KEYS.REALIZATIONS)
          }
          break
        }

        case REFERENCES: {
          if (value.length > 0) {
            const references = [...reassignedConcept.references]
            value.forEach(result => {
              const reference = pickReference(result)
              references.push(reference)
            })
            reassignedConcept.references = references

            await refreshPanelDataFn(PANEL_DATA.KEYS.REFERENCES)
          }
          break
        }

        case TEMPLATES_DEFINED:
        case TEMPLATES_TO:
          if (value.length > 0) {
            await refreshPanelDataFn(PANEL_DATA.KEYS.TEMPLATES)
          }
          break
      }
    })
  )
}

export { applyResults, postSideEffects, preSideEffects }
