import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

import { LABELS } from '@/lib/constants'

const { CANCEL, SAVE } = LABELS.BUTTON

const EditReferenceActions = ({ editReference, isDoiUnique }) => {
  const { closeModal, modalData } = use(ModalContext)
  const { reference } = modalData

  const colors = ['main', 'cancel']
  const disabled = [
    false,
    !reference.citation ||
      !reference.doi ||
      !isDoiUnique(reference.doi, reference.id) ||
      !modalData.modified,
  ]
  const labels = [CANCEL, SAVE]

  const onAction = async label => {
    switch (label) {
      case CANCEL:
        closeModal()
        break

      case SAVE:
        try {
          const updatedData = {
            citation: reference.citation,
            doi: reference.doi,
          }
          await editReference(reference.id, updatedData)
          closeModal()
        } catch (error) {
          console.error('Error updating reference:', error)
          // TODO: Show error message to user
        }
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'EditReferenceActions')
}

export default EditReferenceActions
