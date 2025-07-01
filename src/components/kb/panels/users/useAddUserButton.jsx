import { use, useCallback } from 'react'

import PanelAddButton from '@/components/common/panel/PanelAddButton'
import UserForm from '@/components/kb/panels/users/form/UserForm'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'
import UsersContext from '@/contexts/panels/users/UsersContext'

import { LABELS, PROCESSING, EMAIL_REGEX } from '@/lib/constants'
import { pick, filterObject } from '@/lib/utils'

const { CANCEL, SAVE } = LABELS.BUTTON
const { SAVING } = PROCESSING

const ADD_USER_FIELDS = ['affiliation', 'email', 'firstName', 'lastName', 'password', 'role', 'username']

const initialUser = {
  affiliation: '',
  confirmPassword: '',
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  role: '',
  username: '',
}

// Validation helper functions
const validateUser = userData => {
  const requiredFields = ['affiliation', 'email', 'firstName', 'lastName', 'password', 'role', 'username']
  const allFieldsFilled = requiredFields.every(field => {
    const value = userData[field] || ''
    return value.trim() !== ''
  })
  const isEmailValid = EMAIL_REGEX.test(userData.email || '')
  const passwordsMatch = userData.password === userData.confirmPassword
  
  return allFieldsFilled && isEmailValid && passwordsMatch
}

const calculateHasChanges = userData => {
  // For add mode, any non-empty field means changes
  const fieldsToCheck = ['affiliation', 'email', 'firstName', 'lastName', 'password', 'role', 'username']
  return fieldsToCheck.some(field => {
    const value = userData[field] || ''
    return value.trim() !== ''
  })
}

const useAddUserButton = () => {
  const { closeModal, createModal, updateModalData, setProcessing } = use(PanelModalContext)
  const { addUser, users } = use(UsersContext)

  const handleCancel = useCallback(() => {
    closeModal()
  }, [closeModal])

  const handleFormChange = useCallback(
    updatedUser => {
      const user = {
        ...updatedUser,
        password: updatedUser.password ?? '',
        confirmPassword: updatedUser.confirmPassword ?? '',
      }

      // Calculate validation state at modal level
      const isValid = validateUser(user)
      const hasChanges = calculateHasChanges(user)

      updateModalData({
        user,
        isValid,
        hasChanges,
      })
    },
    [updateModalData]
  )

  const handleCommit = useCallback(
    async user => {
      try {
        if (!validateUser(user)) {
          return
        }

        setProcessing(SAVING)

        // Get clean user data, excluding confirmPassword
        const userData = filterObject(
          pick(user, ADD_USER_FIELDS),
          (key, value) => value && value.trim() !== ''
        )

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
    user => (
      <UserForm
        key='add-user-form'
        user={user}
        originalUser={null}
        onChange={handleFormChange}
        isEdit={false}
        users={users}
      />
    ),
    [handleFormChange, users]
  )

  const addUserModal = useCallback(() => {
    createModal({
      actions: currentModalData => [
        {
          color: 'cancel',
          disabled: false,
          label: CANCEL,
          onClick: handleCancel,
        },
        {
          color: 'primary',
          disabled: !currentModalData.isValid || !currentModalData.hasChanges,
          label: SAVE,
          onClick: () => handleCommit(currentModalData.user),
        },
      ],
      content: currentModalData => content(currentModalData.user),
      title: 'Add User',
      data: {
        user: initialUser,
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
