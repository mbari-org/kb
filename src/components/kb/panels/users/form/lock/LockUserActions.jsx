import { use } from 'react'

import { createActions } from '@/components/modal/panelModalFactory'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

import { LABELS } from '@/lib/constants'

const { CANCEL, LOCK, UNLOCK } = LABELS.BUTTON

const LockUserActions = ({ lockUser }) => {
  const { closeModal, modalData } = use(PanelModalContext)

  const { user } = modalData

  const colors = ['main', 'cancel']
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
