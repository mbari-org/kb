import { use } from 'react'

import { createActions } from '@/components/modal/conceptModalFactory'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const DeleteConceptActions = () => {
  const { apiFns } = use(ConfigContext)
  const { concept, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData, setModalData, setProcessing } = use(ConceptModalContext)
  const { updateSelected } = use(SelectedContext)
  const { deleteConcept, loadConcept } = use(TaxonomyContext)

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
      setProcessing('Deleting concept...')
      const { associatedCounts, reassignTo } = modalData
      modifyConcept({
        field: 'reassignmentData',
        value: { associatedCounts, reassignTo },
      })
      deleteConcept(concept, reassignTo).then(result => {
        const closestConceptName = result.closestConcept.name
        closeModal(true, () => {
          loadConcept(closestConceptName, true)
          updateSelected({ concept: closestConceptName })
        })
      })
        .finally(() => {
          setProcessing(null)
        })
    }
  }
  return createActions({ colors, labels, onAction }, 'DeleteConceptActions:Confirm')
}

export default DeleteConceptActions
