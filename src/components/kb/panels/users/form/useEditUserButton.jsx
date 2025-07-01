import { use, useCallback, useMemo } from 'react'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'
import UsersContext from '@/contexts/panels/users/UsersContext'

import { PROCESSING } from '@/lib/constants'
import {
  createModalActions,
  processEditUserData,
  createHandlers,
  createModalContent,
} from '@/components/kb/panels/users/form/userModalUtils'

const { UPDATING } = PROCESSING

const useEditUserButton = () => {
  const { closeModal, createModal, updateModalData, setProcessing } = use(PanelModalContext)
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

        setProcessing(UPDATING)
        await editUser(user.username, updatedData)
        closeModal()
      } catch (error) {
        setProcessing(false)
        throw error
      }
    },
    [editUser, closeModal, setProcessing]
  )

  const content = useCallback(
    currentModalData => createModalContent(handleFormChange, users, true)(currentModalData),
    [handleFormChange, users]
  )

  const editUserModal = useCallback(
    userToEdit => {
      const modalUser = {
        ...userToEdit,
        password: '',
        confirmPassword: '',
      }

      createModal({
        actions: createModalActions(handleCancel, handleCommit),
        content,
        title: 'Edit User',
        data: {
          user: modalUser,
          original: userToEdit,
          isValid: true,
          hasChanges: false,
        },
      })
    },
    [createModal, content, handleCancel, handleCommit]
  )

  return editUserModal
}

export default useEditUserButton
