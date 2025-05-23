import { use } from 'react'

import { createActions } from '@/components/modal/factory'
import ModalContext from '@/contexts/modal/ModalContext'

import { LABELS } from '@/lib/constants'

const { CANCEL, SAVE } = LABELS.BUTTON

const EditUserActions = () => {
  const { closeModal } = use(ModalContext)

  const colors = ['cancel', 'primary']
  const disabled = [false, false]
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
