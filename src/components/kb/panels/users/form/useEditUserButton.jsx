import { use, useCallback, useMemo } from 'react'

import { useUsersModalOperationsContext, useUsersModalDataContext } from '@/contexts/panels/users/modal'
import UsersContext from '@/contexts/panels/users/UsersContext'
import Title from '@/components/common/factory/Title'
import Actions from '@/components/common/factory/Actions'

import { UI_TEXT } from '@/lib/constants/uiText.js'
import {
  createModalActions,
  processEditUserData,
  createHandlers,
  createModalContent,
} from '@/components/kb/panels/users/form/userModalUtils'

import { CONFIG } from '@/config/js'

const { PROCESSING } = CONFIG
const { CONFIRM_DISCARD, DISCARD } = UI_TEXT.LABELS.BUTTON

const useEditUserButton = () => {
  const { closeModal, createModal, updateModalData, setProcessing } =
    useUsersModalOperationsContext()
  const { editUser, users } = use(UsersContext)

  const { handleCancel, handleFormChange } = useMemo(
    () => createHandlers(updateModalData, closeModal, true),
    [updateModalData, closeModal]
  )

  const handleCommit = useCallback(
    async (user, original) => {
      try {
        const updatedData = processEditUserData(user, original)

        if (!updatedData) {
          closeModal()
          return
        }

        setProcessing(PROCESSING.UPDATE)
        await editUser(user.username, updatedData)
        closeModal()
      } catch (error) {
        setProcessing(PROCESSING.OFF)
        throw error
      }
    },
    [editUser, closeModal, setProcessing]
  )

  const editUserModal = useCallback(
    userToEdit => {
      const modalUser = {
        ...userToEdit,
        password: '',
        confirmPassword: '',
      }

      const ActionView = () => {
        const { modalData } = useUsersModalDataContext()

        const confirmDiscard = !!modalData?.confirmDiscard

        if (confirmDiscard) {
          const colors = ['cancel', 'main']
          const disabled = [false, false]
          const labels = [DISCARD, 'Continue']

          const onAction = label => {
            if (label === DISCARD) {
              closeModal()
            } else {
              updateModalData({ confirmDiscard: false })
            }
          }

          return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
        }

        const actions = createModalActions(handleCancel, handleCommit)(modalData)
        if (!Array.isArray(actions)) return null

        const colors = actions.map(a => a.color || 'main')
        const disabled = actions.map(a => a.disabled || false)
        const labels = actions.map((a, i) => (i === 0 && modalData?.hasChanges ? DISCARD : a.label))

        const onAction = label => {
          if (label === DISCARD || label === CONFIRM_DISCARD) {
            updateModalData({ confirmDiscard: true })
            return
          }
          const a = actions.find(x => x.label === label)
          if (a && a.onClick) a.onClick()
        }

        return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
      }

      const ContentView = () => {
        const { modalData } = useUsersModalDataContext()
        const UserModalContent = createModalContent(handleFormChange, users, true)
        return UserModalContent(modalData)
      }

      const TitleView = () => <Title title='Edit User' />

      createModal({
        actionsComponent: ActionView,
        contentComponent: ContentView,
        titleComponent: TitleView,
        data: {
          user: modalUser,
          original: userToEdit,
          isValid: true,
          hasChanges: false,
        },
        onClose: currentData => {
          const { confirmDiscard, hasChanges } = currentData || {}
          if (!confirmDiscard && hasChanges) {
            updateModalData({ confirmDiscard: true })
            return false
          }
          return true
        },
      })
    },
    [closeModal, createModal, handleCancel, handleCommit, handleFormChange, updateModalData, users]
  )

  return editUserModal
}

export default useEditUserButton
