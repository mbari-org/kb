import { use } from 'react'

import { createActions } from '@/components/modal/factory'
import ModalContext from '@/contexts/modal/ModalContext'

import { LABELS } from '@/lib/constants'

const ADD_USER_FORM_ID = 'add-user-form'

const { CANCEL, SAVE } = LABELS.BUTTON

const AddUserActions = () => {
  const { closeModal, modalData } = use(ModalContext)

  const { modified } = modalData

  const colors = ['cancel', 'main']
  const disabled = [false, !modified]
  const labels = [CANCEL, SAVE]

  const onAction = label => {
    switch (label) {
      case CANCEL:
        closeModal()
        break

      case SAVE:
        // Need to go through the form to trigger required and validation checks
        document.querySelector(`#${ADD_USER_FORM_ID}`)?.requestSubmit()
        closeModal(true)
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'AddUserActions')
}

export default AddUserActions
