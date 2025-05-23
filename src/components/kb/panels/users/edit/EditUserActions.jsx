import { use } from 'react'

import { createActions } from '@/components/modal/factory'
import ModalContext from '@/contexts/modal/ModalContext'

import { LABELS } from '@/lib/constants'

const { CANCEL, SAVE } = LABELS.BUTTON

const EditUserActions = () => {
  const { closeModal, modalData } = use(ModalContext)
  const { user } = modalData

  const colors = ['cancel', 'primary']
  const disabled = [false, !user.isValid]
  const labels = [CANCEL, SAVE]

  const onAction = label => {
    switch (label) {
      case CANCEL:
        closeModal()
        break

      case SAVE:
        closeModal(true)
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'EditUserActions')
}

export default EditUserActions
