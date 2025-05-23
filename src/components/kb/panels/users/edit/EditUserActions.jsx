import { use } from 'react'

import { createActions } from '@/components/modal/factory'
import ModalContext from '@/contexts/modal/ModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'

import { updateUser } from '@/lib/kb/api/users'

import { LABELS } from '@/lib/constants'

import { drop } from '@/lib/util'

const { CANCEL, SAVE } = LABELS.BUTTON

const EditUserActions = () => {
  const { closeModal, modalData } = use(ModalContext)
  const { apiFns } = use(ConfigContext)
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
          const updatedUser = await apiFns.apiPayload(updateUser, [
            user.id,
            drop(user, ['confirmPassword', 'isValid', 'hasChanges', 'originalUser']),
          ])
          closeModal(true, updatedUser)
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
