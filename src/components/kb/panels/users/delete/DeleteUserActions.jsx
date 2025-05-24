import { use } from 'react'

import { createActions } from '@/components/modal/factory'
import ModalContext from '@/contexts/modal/ModalContext'
import UsersContext from '@/contexts/users/UsersContext'

import { LABELS } from '@/lib/constants'

const { CANCEL, DELETE } = LABELS.BUTTON

const DeleteUserActions = () => {
  const { closeModal, modalData } = use(ModalContext)
  const { deleteUser } = use(UsersContext)
  const { user } = modalData

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
          await deleteUser(user.username)
          closeModal()
        } catch (error) {
          console.error('Error deleting user:', error)
          // TODO: Show error message to user
        }
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'DeleteUserActions')
}

export default DeleteUserActions
