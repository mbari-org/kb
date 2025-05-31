import { use, useCallback } from 'react'

import LockUserActions from './LockUserActions'
import LockUserContent from './LockUserContent'
import LockUserTitle from './LockUserTitle'

import LastAdminActions from './LastAdminActions'
import LastAdminContent from './LastAdminContent'
import LastAdminTitle from './LastAdminTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'
import UsersContext from '@/contexts/users/UsersContext'

import { USER_ROLES } from '@/lib/constants'

const lockUserModal = () => {
  const components = {
    Actions: LockUserActions,
    Content: LockUserContent,
    Title: LockUserTitle,
  }

  return createModal(components)
}

const lastAdminModal = () => {
  const components = {
    Actions: LastAdminActions,
    Content: LastAdminContent,
    Title: LastAdminTitle,
  }

  return createModal(components)
}

const useLockUser = () => {
  const { setModal, setModalData } = use(ModalContext)
  const { users } = use(UsersContext)

  return useCallback(
    user => {
      // Check if this is the last unlocked admin
      const unlockedAdmins = users.filter(u => u.role === USER_ROLES.ADMIN && !u.locked)
      const isLastUnlockedAdmin =
        unlockedAdmins.length === 1 && unlockedAdmins[0].username === user.username

      if (isLastUnlockedAdmin) {
        setModal(lastAdminModal())
        setModalData({})
        return
      }

      setModal(lockUserModal())
      setModalData({ user })
    },
    [setModal, setModalData, users]
  )
}

export default useLockUser
