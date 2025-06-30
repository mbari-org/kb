import { use, useCallback } from 'react'

import LockUserActions from './LockUserActions'
import LockUserContent from './LockUserContent'
import LockUserTitle from './LockUserTitle'

import LastAdminActions from './LastAdminActions'
import LastAdminContent from './LastAdminContent'
import LastAdminTitle from './LastAdminTitle'

import { createModal } from '@/components/modal/panelModalFactory'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

import { USER_ROLES } from '@/lib/constants'

const lockUserModal = lockUser => {
  const components = {
    Actions: () => <LockUserActions lockUser={lockUser} />,
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

const useLockUserModal = (lockUser, users) => {
  const { setModal, setModalData } = use(PanelModalContext)

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

      setModal(lockUserModal(lockUser))
      setModalData({ user })
    },
    [lockUser, setModal, setModalData, users]
  )
}

export default useLockUserModal
