import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

import { LABELS } from '@/lib/constants'

const { CANCEL, LOCK, UNLOCK } = LABELS.BUTTON

const LockUserActions = ({ lockUser }) => {
  const { closeModal, modalData } = use(ModalContext)

  const { user } = modalData

  const colors = ['cancel', 'main']
  const disabled = [false, false]
  const labels = [CANCEL, user.locked ? UNLOCK : LOCK]

  const onAction = async label => {
    switch (label) {
      case CANCEL:
        closeModal()
        break

      case LOCK:
      case UNLOCK:
        try {
          await lockUser(user.username, !user.locked)
          closeModal()
        } catch (error) {
          console.error('Error locking/unlocking user:', error)
        }
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'DeleteUserActions')
}

export default LockUserActions
