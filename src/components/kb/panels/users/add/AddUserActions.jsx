import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'

import { createUser } from '@/lib/kb/api/users'

import { LABELS } from '@/lib/constants'

import { drop } from '@/lib/util'

const { CANCEL, SAVE } = LABELS.BUTTON

const AddUserActions = () => {
  const { closeModal, modalData } = use(ModalContext)
  const { apiFns } = use(ConfigContext)
  const { user } = modalData

  const colors = ['cancel', 'primary']
  const disabled = [false, !user.isValid]
  const labels = [CANCEL, SAVE]

  const onAction = async label => {
    switch (label) {
      case CANCEL:
        closeModal()
        break

      case SAVE:
        try {
          const createdUser = await apiFns.apiPayload(
            createUser,
            drop(user, ['confirmPassword', 'hasChanges', 'isValid'])
          )
          closeModal(true, createdUser)
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
