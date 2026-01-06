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

import { deleteConcept as deleteTaxonomyConcept, getConcept as getTaxonomyConcept, insertConcept } from '@/lib/model/taxonomy'

import CONFIG from '@/text'

const { PROCESSING } = CONFIG

const DeleteConceptActions = () => {
  const { apiFns } = use(ConfigContext)
  const { concept } = use(ConceptContext)
  const { closeModal, modalData, setModalData, withProcessing } = use(ConceptModalContext)
  const { getReferences, refreshData: refreshPanelData, setClearTemplateFilters, templates } = use(PanelDataContext)
  const { savePreferences } = use(PreferencesContext)
  const { getSettings, updateSelected } = use(SelectedContext)
  const { taxonomy, updateTaxonomy } = use(TaxonomyContext)
  const { getPreferences } = use(UserContext)

  const isConfirm = modalData?.alertType === 'delete'

  if (!isConfirm) {
    const colors = ['main', 'cancel']
    const labels = ['Discard', 'Delete']
    const onAction = label => {
      if (label === 'Discard') {
        closeModal()
        return
      }
      if (label === 'Delete') {
        setModalData(prev => ({ ...prev, alertType: 'delete' }))
      }
    }
    const disabled = [false, !modalData.isValid]
    return createActions({ colors, disabled, labels, onAction }, 'DeleteConceptActions:Primary')
  }

  const colors = ['main', 'cancel']
  const labels = ['Cancel', 'Confirm']
  const onAction = async label => {
    if (label === 'Cancel') {
      closeModal()
      return
    }

    if (label === 'Confirm') {
      const { reassign } = modalData
      const deleteConceptContext = {
        apiFns,
        relatedDataCounts: modalData.relatedDataCounts,
        concept,
        getPreferences,
        getReferences,
        getSettings,
        reassign,
        refreshPanelData,
        savePreferences,
        setClearTemplateFilters,
        templates,
      }

      // CxNote due to closures the taxonomy must be directly manipulated

      await withProcessing(async () => {
        const preDeleteResults = await preSideEffects(deleteConceptContext)
        const { closestConcept, taxonomy: updatedTaxonomy } =
          await deleteTaxonomyConcept(taxonomy, concept, apiFns)
        const postDeleteResults = await postSideEffects(deleteConceptContext)

        const results = { ...preDeleteResults, ...postDeleteResults }

        const reassignedConcept = { ...getTaxonomyConcept(updatedTaxonomy, reassign) }
        await applyResults(reassignedConcept, refreshPanelData, results)

        insertConcept(reassignedConcept, updatedTaxonomy.conceptMap, updatedTaxonomy.aliasMap)
        updateTaxonomy(updatedTaxonomy)

        closeModal(true, () => {
          updateSelected({ concept: closestConcept.name })
          setClearTemplateFilters(true)
        })
      }, PROCESSING.DELETE, PROCESSING.ARG.CONCEPT)
    }
  }
  return createActions({ colors, labels, onAction }, 'DeleteConceptActions:Confirm')
}

export default DeleteConceptActions
