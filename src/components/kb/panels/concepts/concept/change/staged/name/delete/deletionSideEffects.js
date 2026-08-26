import { renameToConceptAssociations } from '@/lib/api/associations'
import { renameConceptObservations } from '@/lib/api/observations'
import { createRealization, renameToConceptRealizations } from '@/lib/api/realizations'
import { renameReferenceConcept } from '@/lib/api/references'
import { createConceptTemplate, renameToConceptTemplates } from '@/lib/api/templates'

import { RELATED_DATA_COUNTS } from '@/components/kb/panels/concepts/concept/change/staged/name/relatedDataCounts'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

import { PANEL_DATA } from '@/lib/constants/panelData.js'
import { PREFS } from '@/lib/constants/prefs.js'

import dataFilters from '@/contexts/panels/dataFilters'
import { SELECTED } from '@/lib/constants/selected.js'
import { isSame } from '@/lib/model/realization'
import { isIdentical } from '@/lib/model/templates'

const { KEY } = PREFS.USER
const {
  ANNOTATIONS,
  ASSOCIATIONS,
  REALIZATIONS,
  REALIZATIONS_TO,
  REFERENCES,
  TEMPLATES_DEFINED,
  TEMPLATES_TO,
} = RELATED_DATA_COUNTS
const { EMPTY_FILTERS } = dataFilters(SELECTED.SETTINGS.TEMPLATES.KEY)

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
  const { apiFns, concept, realizations, reassign, relatedDataCounts, templates } = deleteConceptContext
  const oldNewPayload = { old: concept.name, new: reassign }

  const results = {}

  for (const count of relatedDataCounts) {
    if (count.value > 0) {
      switch (count.title) {
        case ASSOCIATIONS:
          results[ASSOCIATIONS] = await apiFns.apiPayload(renameToConceptAssociations, oldNewPayload)
          break

        case ANNOTATIONS:
          results[ANNOTATIONS] = await apiFns.apiPayload(renameConceptObservations, oldNewPayload)
          break

        case REALIZATIONS: {
          const realizationsOnReassignedConcept = (realizations || []).filter(r => r.concept === reassign)
          const realizationsToReassign = (
            concept.realizations?.length
              ? concept.realizations
              : (realizations || []).filter(r => r.concept === concept.name)
          ).filter(
            realization =>
              !realizationsOnReassignedConcept.some(existing =>
                isSame(
                  {
                    ...realization,
                    toConcept:
                      realization.toConcept === concept.name || !realization.toConcept
                        ? reassign
                        : realization.toConcept,
                  },
                  existing
                )
              )
          )

          const realizationResults = []
          for (const { linkName, linkValue, toConcept } of realizationsToReassign) {
            const res = await apiFns.apiPayload(createRealization, {
              concept: reassign,
              linkName,
              linkValue,
              toConcept: toConcept === concept.name || !toConcept ? reassign : toConcept,
            })
            realizationResults.push(res)
          }
          results[REALIZATIONS] = realizationResults
          break
        }

        case REALIZATIONS_TO:
          results[REALIZATIONS_TO] = await apiFns.apiPayload(renameToConceptRealizations, oldNewPayload)
          break

        case REFERENCES: {
          const referenceResults = []
          for (const reference of concept.references || []) {
            const res = await apiFns.apiPayload(renameReferenceConcept, [reference.id, concept.name, reassign])
            referenceResults.push(res)
          }
          results[REFERENCES] = referenceResults
          break
        }

        case TEMPLATES_DEFINED: {
          const templatesOnReassignedConcept = filterTemplates(templates, { concepts: [reassign] })
          const templateToReassign = filterTemplates(templates, { concepts: [concept.name] }).filter(
            template =>
              !templatesOnReassignedConcept.some(existing =>
                isIdentical(
                  {
                    ...template,
                    toConcept: template.toConcept || reassign,
                  },
                  existing
                )
              )
          )

          const templateResults = []
          for (const { linkName, linkValue, toConcept } of templateToReassign) {
            const res = await apiFns.apiPayload(createConceptTemplate, {
              concept: reassign,
              linkName,
              linkValue,
              toConcept: toConcept || reassign,
            })
            templateResults.push(res)
          }
          results[TEMPLATES_DEFINED] = templateResults
          break
        }

        case TEMPLATES_TO:
          results[TEMPLATES_TO] = await apiFns.apiPayload(renameToConceptTemplates, oldNewPayload)
          break
      }
    }
  }

  return results
}

const postSideEffects = async deleteConceptContext => {
  const { refreshPanelData: refreshPanelDataFn } = deleteConceptContext

  await performConceptPrefsUpdate(deleteConceptContext)
  await performSettingsUpdate(deleteConceptContext)
  await Promise.all([refreshPanelDataFn(PANEL_DATA.REFERENCES), refreshPanelDataFn(PANEL_DATA.REALIZATIONS)])
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
        case REALIZATIONS_TO:
          if (value.length > 0) {
            await refreshPanelDataFn(PANEL_DATA.REALIZATIONS)
          }
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
