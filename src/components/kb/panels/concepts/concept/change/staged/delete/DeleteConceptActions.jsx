import { use } from 'react'

import { createActions } from '@/components/modal/conceptModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const DeleteConceptActions = () => {
  const { concept } = use(ConceptContext)
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
      console.log('Deleting concept...', modalData)
      deleteConcept(concept, modalData.reassignTo)
        .then(result => {
          closeModal(true, () => {
            loadConcept(result.closestConcept.name, true)
            updateSelected({ concept: result.closestConcept.name })
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
