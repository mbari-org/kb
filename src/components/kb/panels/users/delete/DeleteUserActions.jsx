import { use } from 'react'

import { createActions } from '@/components/modal/factory'
import ModalContext from '@/contexts/modal/ModalContext'

import { LABELS } from '@/lib/constants'

const { CANCEL, DELETE } = LABELS.BUTTON

const DeleteUserActions = () => {
  const { closeModal } = use(ModalContext)

  const colors = ['main', 'cancel']
  const disabled = [false, false]
  const labels = [CANCEL, DELETE]

  const onAction = label => {
    switch (label) {
      case CANCEL:
        closeModal()
        break

      case DELETE:
        closeModal(true)
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'DeleteUserActions')
}

export default DeleteUserActions
