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

import applySideEffects from './applySideEffects'

const DeleteConceptActions = () => {
  const { apiFns } = use(ConfigContext)
  const { concept } = use(ConceptContext)
  const { closeModal, modalData, setModalData } = use(ConceptModalContext)
  const { getReferences, refreshData: refreshPanelData } = use(PanelDataContext)
  const { savePreferences } = use(PreferencesContext)
  const { updateSelected } = use(SelectedContext)
  const { deleteConcept, loadConcept } = use(TaxonomyContext)
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
  const onAction = label => {
    if (label === 'Cancel') {
      closeModal()
      return
    }

    if (label === 'Confirm') {
      const { reassignTo } = modalData
      deleteConcept(concept, reassignTo).then(async closestConcept => {
        const updatesContext = {
          apiFns,
          getPreferences,
          getReferences,
          refreshPanelData,
          savePreferences,
        }
        await applySideEffects(updatesContext, concept.name, modalData.reassignmentData)
        updateSelected({ concept: closestConcept.name })
        closeModal(true, () => {
          loadConcept(closestConcept.name)
        })
      })
    }
  }
  return createActions({ colors, labels, onAction }, 'DeleteConceptActions:Confirm')
}

export default DeleteConceptActions
