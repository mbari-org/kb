import { use, useCallback, useMemo } from 'react'

import PanelAddButton from '@/components/common/panel/PanelAddButton'

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
  const { closeModal, createModal, updateModalData, setProcessing } = useUsersModalOperationsContext()
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

  const content = useCallback(
    currentModalData => createModalContent(handleFormChange, users, false)(currentModalData),
    [handleFormChange, users]
  )

  const addUserModal = useCallback(() => {
    createModal({
      actions: createModalActions(handleCancel, handleCommit),
      content,
      title: 'Add User',
      data: {
        user: createInitialUser(),
        isValid: false,
        hasChanges: false,
      },
    })
  }, [createModal, content, handleCancel, handleCommit])

  const AddUserButton = useCallback(() => <PanelAddButton onClick={addUserModal} />, [addUserModal])

  return AddUserButton
}

export default useAddUserButton
