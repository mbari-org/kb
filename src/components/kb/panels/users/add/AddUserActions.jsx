import { use } from 'react'

import { createActions } from '@/components/modal/factory'
import ModalContext from '@/contexts/modal/ModalContext'

import { LABELS } from '@/lib/constants'

const { CANCEL, ADD } = LABELS.BUTTON

const AddUserActions = () => {
  const { closeModal, modalData } = use(ModalContext)
  const { user } = modalData

  const colors = ['cancel', 'primary']
  const disabled = [false, !user.isValid]
  const labels = [CANCEL, ADD]

  const onAction = label => {
    switch (label) {
      case CANCEL:
        closeModal()
        break

      case ADD:
        closeModal(true)
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'AddUserActions')
}

export default AddUserActions
