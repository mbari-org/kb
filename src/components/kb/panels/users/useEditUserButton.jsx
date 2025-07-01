import { use, useCallback } from 'react'

import UserForm from '@/components/kb/panels/users/form/UserForm'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'
import UsersContext from '@/contexts/panels/users/UsersContext'

import { LABELS, PROCESSING, EMAIL_REGEX } from '@/lib/constants'
import { pick, diff, filterObject } from '@/lib/utils'

const { CANCEL, SAVE } = LABELS.BUTTON
const { UPDATING } = PROCESSING

const EDITABLE_FIELDS = ['affiliation', 'email', 'firstName', 'lastName', 'role']

// Validation helper functions
const validateUser = userData => {
  const requiredFields = ['affiliation', 'email', 'firstName', 'lastName', 'role', 'username']
  const allFieldsFilled = requiredFields.every(field => {
    const value = userData[field] || ''
    return value.trim() !== ''
  })
  const isEmailValid = EMAIL_REGEX.test(userData.email || '')
  const passwordsMatch = userData.password ? userData.password === userData.confirmPassword : true

  return allFieldsFilled && isEmailValid && passwordsMatch
}

const calculateHasChanges = (userData, originalUser) => {
  const fieldsToCompare = ['affiliation', 'email', 'firstName', 'lastName', 'role']
  return (
    fieldsToCompare.some(field => userData[field] !== originalUser[field]) ||
    (userData.password && userData.password.trim() !== '')
  )
}

const useEditUserButton = () => {
  const { closeModal, createModal, updateModalData, setProcessing } = use(PanelModalContext)
  const { editUser, users } = use(UsersContext)

  const handleCancel = useCallback(() => {
    closeModal()
  }, [closeModal])

  const handleCommit = useCallback(
    async (user, original) => {
      try {
        const hasFieldChanges = EDITABLE_FIELDS.some(field => user[field] !== original[field])
        const hasPasswordChange = user.password != null && user.password.trim() !== ''

        if (!hasFieldChanges && !hasPasswordChange) {
          closeModal()
          return
        }

        setProcessing(UPDATING)

        // Get updates, excluding empty password
        const updatedData = filterObject(
          diff(pick(user, [...EDITABLE_FIELDS, 'password']), original),
          (key, value) => !(key === 'password' && (!value || value.trim() === ''))
        )

        await editUser(user.username, updatedData)
        closeModal()
      } catch (error) {
        setProcessing(false)
        throw error
      }
    },
    [editUser, closeModal, setProcessing]
  )

  const handleFormChange = useCallback(
    (updatedUser, originalUser) => {
      const user = {
        ...updatedUser,
        password: updatedUser.password ?? '',
        confirmPassword: updatedUser.confirmPassword ?? '',
      }

      // Calculate validation state at modal level
      const isValid = validateUser(user)
      const hasChanges = calculateHasChanges(user, originalUser)

      updateModalData({
        user,
        isValid,
        hasChanges,
      })
    },
    [updateModalData]
  )

  const content = useCallback(
    (user, originalUser) => {
      // Only set password defaults if they're undefined (not if they're empty strings)
      const userWithConfirmPassword = {
        ...user,
        password: user.password ?? '',
        confirmPassword: user.confirmPassword ?? '',
      }

      return (
        <UserForm
          key='edit-user-form'
          user={userWithConfirmPassword}
          originalUser={originalUser}
          onChange={handleFormChange}
          isEdit
          users={users}
        />
      )
    },
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
            onClick: () => handleCommit(currentModalData.user, currentModalData.originalUser),
          },
        ],
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
