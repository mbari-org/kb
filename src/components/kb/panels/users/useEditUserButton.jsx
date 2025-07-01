import { use, useCallback } from 'react'

import UserForm from '@/components/kb/panels/users/form/UserForm'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'
import UsersContext from '@/contexts/panels/users/UsersContext'

import { PROCESSING } from '@/lib/constants'
import {
  createFormChangeHandler,
  createCancelHandler,
  createModalActions,
  createModalContent,
  processEditUserData,
} from './userModalUtils'

const { UPDATING } = PROCESSING

const useEditUserButton = () => {
  const { closeModal, createModal, updateModalData, setProcessing } = use(PanelModalContext)
  const { editUser, users } = use(UsersContext)

  // Create shared handlers using utilities
  const handleCancel = useCallback(
    createCancelHandler(closeModal),
    [closeModal]
  )
  const handleFormChange = useCallback(
    createFormChangeHandler(updateModalData, true), // isEdit = true
    [updateModalData]
  )

  const handleCommit = useCallback(
    async (user, originalUser) => {
      try {
        const updatedData = processEditUserData(user, originalUser)
        
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

  // Create shared content using utility
  const content = useCallback(
    createModalContent(UserForm, handleFormChange, users, true, 'edit-user-form'),
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
        content: currentModalData => content(currentModalData.user, currentModalData.originalUser),
        title: 'Edit User',
        data: {
          user: modalUser,
          originalUser: userToEdit,
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
