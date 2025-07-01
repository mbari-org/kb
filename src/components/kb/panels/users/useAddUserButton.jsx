import { use, useCallback } from 'react'

import PanelAddButton from '@/components/common/panel/PanelAddButton'
import UserForm from '@/components/kb/panels/users/form/UserForm'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'
import UsersContext from '@/contexts/panels/users/UsersContext'

import { PROCESSING } from '@/lib/constants'
import {
  createFormChangeHandler,
  createCancelHandler,
  createModalActions,
  createModalContent,
  createUserValidator,
  createInitialUser,
  processAddUserData,
} from './userModalUtils'

const { SAVING } = PROCESSING

const useAddUserButton = () => {
  const { closeModal, createModal, updateModalData, setProcessing } = use(PanelModalContext)
  const { addUser, users } = use(UsersContext)

  // Create shared handlers using utilities
  const handleCancel = useCallback(
    createCancelHandler(closeModal),
    [closeModal]
  )
  const handleFormChange = useCallback(
    createFormChangeHandler(updateModalData, false), // isEdit = false
    [updateModalData]
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

  // Create shared content using utility
  const content = useCallback(
    createModalContent(UserForm, handleFormChange, users, false, 'add-user-form'),
    [handleFormChange, users]
  )

  const addUserModal = useCallback(() => {
    createModal({
      actions: createModalActions(handleCancel, handleCommit),
      content: currentModalData => content(currentModalData.user),
      title: 'Add User',
      data: {
        user: createInitialUser(),
        isValid: false,
        hasChanges: false,
      },
    })
  }, [createModal, content, handleCancel, handleCommit])

  const AddUserButton = useCallback(() => (
    <PanelAddButton onClick={addUserModal} />
  ), [addUserModal])

  return AddUserButton
}

export default useAddUserButton
