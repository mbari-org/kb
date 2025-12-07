import { use, useCallback, useMemo } from 'react'

import PanelAddButton from '@/components/common/panel/PanelAddButton'
import Title from '@/components/common/factory/Title'
import Actions from '@/components/common/factory/Actions'
import { useUsersModalDataContext } from '@/contexts/panels/users/modal'
import { createError, createValidationError } from '@/lib/errors'

import { useUsersModalOperationsContext } from '@/contexts/panels/users/modal'
import UsersContext from '@/contexts/panels/users/UsersContext'

import { UI_TEXT } from '@/lib/kb/constants/uiText.js'
import {
  createModalActions,
  createUserValidator,
  createInitialUser,
  processAddUserData,
  createHandlers,
  createModalContent,
} from '@/components/kb/panels/users/form/userModalUtils'

const { SAVING } = UI_TEXT.PROCESSING
const { CONFIRM_DISCARD, DISCARD } = UI_TEXT.LABELS.BUTTON

const useAddUserButton = () => {
  const { closeModal, createModal, updateModalData, setProcessing } =
    useUsersModalOperationsContext()
  const { addUser, users } = use(UsersContext)

  const { handleCancel, handleFormChange } = useMemo(
    () => createHandlers(updateModalData, closeModal, false),
    [updateModalData, closeModal]
  )

  const handleCommit = useCallback(
    async user => {
      try {
        const validateUser = createUserValidator(false)
        if (!validateUser(user)) {
          throw createValidationError('Invalid user data', { user })
        }

        setProcessing(SAVING)

        const userData = processAddUserData(user)
        await addUser(userData)
        closeModal()
      } catch (error) {
        setProcessing(false)
        if (error.title === 'Validation Error') {
          throw error
        }
        throw createError(
          'User Creation Error',
          'Failed to create new user',
          { userData: processAddUserData(user) },
          error
        )
      }
    },
    [addUser, closeModal, setProcessing]
  )

  // const content = useCallback(
  //   currentModalData => createModalContent(handleFormChange, users, false)(currentModalData),
  //   [handleFormChange, users]
  // )

  const addUserModal = useCallback(() => {
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
      const labels = actions.map((a, i) => {
        if (i === 0 && modalData?.hasChanges) {
          return DISCARD
        }
        return a.label
      })

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
      const UserModalContent = createModalContent(handleFormChange, users, false)
      return UserModalContent(modalData)
    }

    const TitleView = () => <Title title='Add User' />

    createModal({
      actionsComponent: ActionView,
      contentComponent: ContentView,
      titleComponent: TitleView,
      data: {
        user: createInitialUser(),
        isValid: false,
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
  }, [closeModal, createModal, handleCancel, handleCommit, handleFormChange, updateModalData, users])

  const AddUserButton = useCallback(() => <PanelAddButton onClick={addUserModal} />, [addUserModal])

  return AddUserButton
}

export default useAddUserButton
