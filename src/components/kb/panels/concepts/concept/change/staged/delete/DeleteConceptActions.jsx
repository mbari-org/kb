import { use } from 'react'

import { createActions } from '@/components/modal/conceptModalFactory'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { REASSIGNMENTS } from './useDeleteConceptModal'

const DeleteConceptActions = () => {
  const { apiFns } = use(ConfigContext)
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
      const { reassignTo, reassignmentCounts } = modalData
      const renamePayload = {
        old: concept.name,
        new: reassignTo,
      }
      const apiPromises = REASSIGNMENTS.reduce((acc, reassignment) => {
        if (reassignment.renameFn && reassignmentCounts[reassignment.title] > 0) {
          acc.push(apiFns.apiPayload(reassignment.renameFn, renamePayload))
        }
        return acc
      }, [deleteConcept(concept, reassignTo)])

      Promise.all(apiPromises).then(results => {
        const closestConceptName = results[0].closestConcept.name
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
