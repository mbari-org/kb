import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import AuthContext from '@/contexts/auth/AuthContext'
import ModalContext from '@/contexts/modal/ModalContext'

const LogoutActions = () => {
  const { logout } = use(AuthContext)
  const { closeModal } = use(ModalContext)

  const colors = ['main', 'cancel']
  const labels = ['Cancel', 'Logout']

  const onAction = label => {
    if (label === 'Logout') {
      logout()
    }
    closeModal()
  }

  return createActions({ colors, labels, onAction }, 'LogoutActions')
}

export default LogoutActions
