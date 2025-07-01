import { EMAIL_REGEX, LABELS } from '@/lib/constants'
import { diff, filterObject, pick } from '@/lib/utils'

const { CANCEL, SAVE } = LABELS.BUTTON

// Common field definitions
export const USER_FIELDS = {
  EDITABLE: ['affiliation', 'email', 'firstName', 'lastName', 'role'],
  REQUIRED_BASE: ['affiliation', 'email', 'firstName', 'lastName', 'role', 'username'],
  REQUIRED_ADD: ['affiliation', 'email', 'firstName', 'lastName', 'password', 'role', 'username'],
  ADD_SUBMIT: ['affiliation', 'email', 'firstName', 'lastName', 'password', 'role', 'username'],
}

// Shared validation logic
export const createUserValidator =
  (isEdit = false) =>
  userData => {
    const requiredFields = isEdit ? USER_FIELDS.REQUIRED_BASE : USER_FIELDS.REQUIRED_ADD

    const allFieldsFilled = requiredFields.every(field => {
      const value = userData[field] || ''
      return value.trim() !== ''
    })

    const isEmailValid = EMAIL_REGEX.test(userData.email || '')

    const passwordsMatch = isEdit
      ? userData.password
        ? userData.password === userData.confirmPassword
        : true
      : userData.password === userData.confirmPassword

    return allFieldsFilled && isEmailValid && passwordsMatch
  }

// Shared change detection logic
export const createChangeDetector =
  (isEdit = false) =>
  (userData, originalUser = null) => {
    if (!isEdit) {
      // For add mode, any non-empty field means changes
      const fieldsToCheck = USER_FIELDS.REQUIRED_ADD
      return fieldsToCheck.some(field => {
        const value = userData[field] || ''
        return value.trim() !== ''
      })
    }

    // For edit mode, compare with original
    const fieldsToCompare = USER_FIELDS.EDITABLE
    return (
      fieldsToCompare.some(field => userData[field] !== originalUser[field]) ||
      (userData.password && userData.password.trim() !== '')
    )
  }

// Shared form change handler factory
export const createFormChangeHandler = (updateModalData, isEdit = false) => {
  const validateUser = createUserValidator(isEdit)
  const calculateHasChanges = createChangeDetector(isEdit)

  return (updatedUser, originalUser = null) => {
    const user = {
      ...updatedUser,
      password: updatedUser.password ?? '',
      confirmPassword: updatedUser.confirmPassword ?? '',
    }

    const isValid = validateUser(user)
    const hasChanges = calculateHasChanges(user, originalUser)

    updateModalData({
      user,
      isValid,
      hasChanges,
    })
  }
}

// Shared cancel handler
export const createCancelHandler = closeModal => () => {
  closeModal()
}

// Shared action factory
export const createModalActions =
  (handleCancel, handleCommit, saveLabel = SAVE) =>
  currentModalData =>
    [
      {
        color: 'cancel',
        disabled: false,
        label: CANCEL,
        onClick: handleCancel,
      },
      {
        color: 'primary',
        disabled: !currentModalData.isValid || !currentModalData.hasChanges,
        label: saveLabel,
        onClick: () => handleCommit(currentModalData.user, currentModalData.originalUser),
      },
    ]

// Shared content factory
export const createModalContent = (FormComponent, handleFormChange, users, isEdit, formKey) => {
  return useCallback(
    (user, originalUser = null) => {
      const userWithConfirmPassword = {
        ...user,
        password: user.password ?? '',
        confirmPassword: user.confirmPassword ?? '',
      }

      return (
        <FormComponent
          key={formKey}
          user={userWithConfirmPassword}
          originalUser={originalUser}
          onChange={handleFormChange}
          isEdit={isEdit}
          users={users}
        />
      )
    },
    [handleFormChange, users, isEdit, formKey]
  )
}

// Initial user data
export const createInitialUser = () => ({
  affiliation: '',
  confirmPassword: '',
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  role: '',
  username: '',
})

// Data processing utilities for edit mode
export const processEditUserData = (user, originalUser) => {
  const hasFieldChanges = USER_FIELDS.EDITABLE.some(field => user[field] !== originalUser[field])
  const hasPasswordChange = user.password != null && user.password.trim() !== ''

  if (!hasFieldChanges && !hasPasswordChange) {
    return null // No changes
  }

  // Get updates, excluding empty password
  return filterObject(
    diff(pick(user, [...USER_FIELDS.EDITABLE, 'password']), originalUser),
    (key, value) => !(key === 'password' && (!value || value.trim() === ''))
  )
}

// Data processing utilities for add mode
export const processAddUserData = user => {
  return filterObject(
    pick(user, USER_FIELDS.ADD_SUBMIT),
    (key, value) => value && value.trim() !== ''
  )
}
