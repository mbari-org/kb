import { use } from 'react'

import { createActions } from '@/components/modal/factory'
import ModalContext from '@/contexts/modal/ModalContext'
import UsersContext from '@/contexts/users/UsersContext'

import { LABELS } from '@/lib/constants'

import { drop } from '@/lib/util'

const { CANCEL, SAVE } = LABELS.BUTTON

const EditUserActions = () => {
  const { closeModal, modalData } = use(ModalContext)
  const { editUser } = use(UsersContext)
  const { user } = modalData

  const colors = ['cancel', 'primary']
  const disabled = [false, !user.isValid || !user.hasChanges]
  const labels = [CANCEL, SAVE]

  const onAction = async label => {
    switch (label) {
      case CANCEL:
        closeModal()
        break

      case SAVE:
        try {
          const userData = drop(user, [
            'confirmPassword',
            'hasChanges',
            'isEncrypted',
            'isValid',
            'originalUser',
          ])
          const updatedUserData = Object.fromEntries(
            Object.entries(userData).filter(([key, value]) => value !== user.originalUser[key])
          )
          if (user.password === '') {
            delete updatedUserData.password
          }
          await editUser(user.username, updatedUserData)
          closeModal()
        } catch (error) {
          console.error('Error updating user:', error)
          // TODO: Show error message to user
        }
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'EditUserActions')
}

export default EditUserActions
