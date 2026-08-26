import { use } from 'react'

import { createActions } from '@/components/modal/conceptModalFactory'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import PreferencesContext from '@/contexts/preferences/PreferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import { applyResults, preSideEffects, postSideEffects } from './deletionSideEffects'

import { normalizeConcept } from '@/lib/api/concept'
import {
  deleteConcept as deleteTaxonomyConcept,
  getConcept as getTaxonomyConcept,
  insertConcept,
} from '@/lib/model/taxonomy'

import CONFIG from '@/lib/config'

const { PROCESSING } = CONFIG
const { CANCEL, CONFIRM, DELETE, DISCARD } = CONFIG.BUTTON

const DeleteConceptActions = () => {
  const { apiFns } = use(ConfigContext)
  const { concept } = use(ConceptContext)
  const { closeModal, modalData, setModalData, withProcessing } = use(ConceptModalContext)
  const { getReferences, realizations, refreshData: refreshPanelData, setClearTemplateFilters, templates } =
    use(PanelDataContext)
  const { savePreferences } = use(PreferencesContext)
  const { settings, updateSelected } = use(SelectedContext)
  const { taxonomy, updateTaxonomy } = use(TaxonomyContext)
  const { getPreferences } = use(UserContext)

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
        const { reassign } = modalData
        const deleteConceptContext = {
          apiFns,
          relatedDataCounts: modalData.relatedDataCounts,
          concept,
          getPreferences,
          getReferences,
          realizations,
          reassign,
          refreshPanelData,
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

            closeModal(true, () => {
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
