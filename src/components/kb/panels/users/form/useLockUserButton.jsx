import { use, useCallback, useMemo } from 'react'

import { useUsersModalOperationsContext } from '@/contexts/panels/users/modal'
import UsersContext from '@/contexts/panels/users/UsersContext'

import { USER_ROLES } from '@/lib/constants'
import {
  createLockUserActions,
  createLockUserContent,
  createLockUserTitle,
} from '@/components/kb/panels/users/form/userModalUtils'

const useLockUserButton = () => {
  const { createModal, closeModal } = useUsersModalOperationsContext()
  const { lockUser, users } = use(UsersContext)

  const handleCancel = useCallback(() => {
    closeModal()
  }, [closeModal])

  const handleLockToggle = useCallback(
    async user => {
      try {
        await lockUser(user.username, !user.locked)
        closeModal()
      } catch (error) {
        console.error('Error locking/unlocking user:', error)
      }
    },
    [lockUser, closeModal]
  )

  const memoizedActions = useMemo(
    () => createLockUserActions(handleCancel, handleLockToggle),
    [handleCancel, handleLockToggle]
  )
  const memoizedContent = useMemo(() => createLockUserContent(), [])
  const memoizedTitle = useMemo(() => createLockUserTitle, [])

  return useCallback(
    user => {
      // Check if this is the last unlocked admin
      const unlockedAdmins = users.filter(u => u.role === USER_ROLES.ADMIN && !u.locked)
      const isLastAdmin =
        unlockedAdmins.length === 1 && unlockedAdmins[0].username === user.username

      const modalData = {
        user,
        isLastAdmin,
      }

      createModal({
        actions: memoizedActions,
        content: memoizedContent,
        title: memoizedTitle(modalData),
        data: modalData,
      })
    },
    [users, createModal, memoizedActions, memoizedContent, memoizedTitle]
  )
}

export default useLockUserButton
