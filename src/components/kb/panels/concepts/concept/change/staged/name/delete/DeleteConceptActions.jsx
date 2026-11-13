import { use } from 'react'

import { createActions } from '@/components/modal/conceptModalFactory'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import PreferencesContext from '@/contexts/preferences/PreferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import { applyResults, preSideEffects, postSideEffects } from './deletionSideEffects'

import { normalizeConcept, deleteConcept as apiDeleteConcept } from '@/lib/api/concept'
import {
  deleteConcept as deleteTaxonomyConcept,
  getConcept as getTaxonomyConcept,
  insertConcept,
} from '@/lib/model/taxonomy'

import { PANEL_DATA } from '@/lib/constants/panelData.js'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

import CONFIG from '@/lib/config'

const { PROCESSING } = CONFIG
const { CANCEL, CONFIRM, DELETE, DISCARD } = CONFIG.BUTTON

const DeleteConceptActions = () => {
  const { apiFns } = use(ConfigContext)
  const { concept, initialState, setEditing } = use(ConceptContext)
  const { modifyConcept } = use(ConceptStagedContext)
  const { closeModal, setModalData, withProcessing } = use(ConceptModalContext)
  const { modalData } = use(ConceptModalDataContext)
  const {
    ensureConceptRealizations,
    getReferences,
    invalidateConceptRealizations,
    refreshData: refreshPanelData,
    renameRealizationToConceptNames,
    setClearTemplateFilters,
    templates,
  } = use(PanelDataContext)
  const { savePreferences } = use(PreferencesContext)
  const { concepts: conceptSelection, updateSelected } = use(SelectedContext)
  const { settings } = use(SelectedSettingsContext)
  const { taxonomy, updateTaxonomy } = use(TaxonomyContext)
  const { getPreferences, isAdmin } = use(UserContext)

  const isConfirm = modalData?.alertType === 'delete'

  if (!isConfirm) {
    const colors = ['main', 'cancel']
    const labels = [DISCARD, DELETE]
    const onAction = async label => {
      switch (label) {
        case DISCARD:
          closeModal()
          break

        case DELETE:
          setModalData(prev => ({ ...prev, alertType: 'delete' }))
          break

        default:
          throw new Error(`Invalid delete concept primary action: ${label}`)
      }
    }
    const disabled = [false, !modalData.isValid]
    return createActions({ colors, disabled, labels, onAction }, 'DeleteConceptActions:Primary')
  }

  const colors = ['main', 'cancel']
  const labels = [CANCEL, CONFIRM]
  const onAction = async label => {
    switch (label) {
      case CANCEL:
        closeModal()
        break

      case CONFIRM: {
        if (!isAdmin) {
          await withProcessing(
            async () => {
              await apiFns.apiPayload(apiDeleteConcept, concept.name)
              await refreshPanelData(PANEL_DATA.PENDING_HISTORY)
              modifyConcept({ type: CONCEPT_STATE.INITIAL, update: { ...initialState } })
              setEditing(false)
              closeModal(true)
            },
            PROCESSING.DELETE,
            PROCESSING.ARG.CONCEPT
          )
          break
        }

        const { reassign } = modalData
        const deleteConceptContext = {
          apiFns,
          relatedDataCounts: modalData.relatedDataCounts,
          concept,
          ensureConceptRealizations,
          getPreferences,
          getReferences,
          invalidateConceptRealizations,
          reassign,
          refreshPanelData,
          renameRealizationToConceptNames,
          savePreferences,
          setClearTemplateFilters,
          settings,
          templates,
        }

        // CxNote due to closures the taxonomy must be directly manipulated

        await withProcessing(
          async () => {
            const preDeleteResults = await preSideEffects(deleteConceptContext)
            const { closestConcept, taxonomy: updatedTaxonomy } = await deleteTaxonomyConcept(taxonomy, concept, apiFns)
            const postDeleteResults = await postSideEffects(deleteConceptContext)

            const results = { ...preDeleteResults, ...postDeleteResults }

            await applyResults(refreshPanelData, results)

            if (reassign) {
              const reassignedConcept = getTaxonomyConcept(updatedTaxonomy, reassign)
              if (reassignedConcept) {
                await normalizeConcept(apiFns, reassignedConcept)
                insertConcept(reassignedConcept, updatedTaxonomy.conceptMap, updatedTaxonomy.aliasMap)
              }
            }
            if (closestConcept && closestConcept.name !== reassign) {
              const closestInTaxonomy = getTaxonomyConcept(updatedTaxonomy, closestConcept.name)
              if (closestInTaxonomy) {
                await normalizeConcept(apiFns, closestInTaxonomy)
                insertConcept(closestInTaxonomy, updatedTaxonomy.conceptMap, updatedTaxonomy.aliasMap)
              }
            }

            updateTaxonomy(updatedTaxonomy)

            modifyConcept({ type: CONCEPT_STATE.INITIAL, update: { ...initialState } })
            closeModal(true, () => {
              conceptSelection.removeName(concept.name)
              updateSelected({ concept: closestConcept.name })
              setClearTemplateFilters(true)
            })
          },
          PROCESSING.DELETE,
          PROCESSING.ARG.CONCEPT
        )
        break
      }
      default:
        throw new Error(`Invalid delete concept confirm action: ${label}`)
    }
  }
  return createActions({ colors, labels, onAction }, 'DeleteConceptActions:Confirm')
}

export default DeleteConceptActions
