import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

import { LABELS } from '@/lib/constants'

const { CANCEL, DELETE } = LABELS.BUTTON

const DeleteReferenceActions = ({ deleteReference }) => {
  const { closeModal, modalData } = use(ModalContext)
  const { reference } = modalData

  const colors = ['main', 'cancel']
  const disabled = [false, false]
  const labels = [CANCEL, DELETE]

  const onAction = async label => {
    switch (label) {
      case CANCEL:
        closeModal()
        break

      case DELETE:
        try {
          await deleteReference(reference)
          closeModal()
        } catch (error) {
          console.error('Error deleting reference:', error)
          // TODO: Show error message to user
        }
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'DeleteReferenceActions')
}

export default DeleteReferenceActions
