import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

import { LABELS } from '@/lib/constants'

import { drop } from '@/lib/util'

const { CANCEL, SAVE } = LABELS.BUTTON

const AddUserActions = ({ addUser }) => {
  const { closeModal, modalData } = use(ModalContext)

  const { user } = modalData

  const colors = ['main', 'cancel']
  const disabled = [false, !user.isValid]
  const labels = [CANCEL, SAVE]

  const onAction = async label => {
    switch (label) {
      case CANCEL:
        closeModal()
        break

      case SAVE:
        try {
          const newUser = drop(user, ['confirmPassword', 'hasChanges', 'isValid'])
          await addUser(newUser)
          closeModal()
        } catch (error) {
          console.error('Error creating user:', error)
          // TODO: Show error message to user
        }
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'AddUserActions')
}

export default AddUserActions
