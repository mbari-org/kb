import { use, useCallback, useMemo } from 'react'

import PanelAddButton from '@/components/common/panel/PanelAddButton'
import Title from '@/components/common/factory/Title'
import Actions from '@/components/common/factory/Actions'
import { useUsersModalDataContext } from '@/contexts/panels/users/modal'

import { useUsersModalOperationsContext } from '@/contexts/panels/users/modal'
import UsersContext from '@/contexts/panels/users/UsersContext'

import { PROCESSING } from '@/lib/constants'
import {
  createModalActions,
  createUserValidator,
  createInitialUser,
  processAddUserData,
  createHandlers,
  createModalContent,
} from '@/components/kb/panels/users/form/userModalUtils'

const { SAVING } = PROCESSING

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
          return
        }

        setProcessing(SAVING)

        const userData = processAddUserData(user)
        await addUser(userData)
        closeModal()
      } catch (error) {
        setProcessing(false)
        throw error
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
      const actions = createModalActions(handleCancel, handleCommit)(modalData)
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
    })
  }, [createModal, handleFormChange, users, handleCancel, handleCommit])

  const AddUserButton = useCallback(() => <PanelAddButton onClick={addUserModal} />, [addUserModal])

  return AddUserButton
}

export default useAddUserButton
