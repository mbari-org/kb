import { use, useCallback } from 'react'

import { useUsersModalOperationsContext, useUsersModalDataContext } from '@/contexts/panels/users/modal'
import UsersContext from '@/contexts/panels/users/UsersContext'
import Title from '@/components/common/factory/Title'
import Actions from '@/components/common/factory/Actions'

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

  return useCallback(
    user => {
      // Check if this is the last unlocked admin
      const unlockedAdmins = users.filter(user => user.role === USER_ROLES.ADMIN && !user.locked)
      const isLastAdmin =
        unlockedAdmins.length === 1 && unlockedAdmins[0].username === user.username

      const ActionView = () => {
        const { modalData } = useUsersModalDataContext()
        const actions = createLockUserActions(handleCancel, handleLockToggle)(modalData)
        if (!Array.isArray(actions)) return null

        const colors = actions.map(a => a.color || 'main')
        const disabled = actions.map(a => a.disabled || false)
        const labels = actions.map(a => a.label)

        const onAction = label => {
          const a = actions.find(x => x.label === label)
          if (a && a.onClick) a.onClick()
        }

        return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
      }

      const ContentView = () => {
        const { modalData } = useUsersModalDataContext()
        const LockUserContent = createLockUserContent()
        return LockUserContent(modalData)
      }

      const TitleView = () => {
        const { modalData } = useUsersModalDataContext()
        return <Title title={createLockUserTitle(modalData)} />
      }

      createModal({
        actionsComponent: ActionView,
        contentComponent: ContentView,
        titleComponent: TitleView,
        data: {
          user,
          isLastAdmin,
        },
      })
    },
    [users, createModal, handleCancel, handleLockToggle]
  )
}

export default useLockUserButton
