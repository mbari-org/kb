import { EMAIL_REGEX, LABELS } from '@/lib/constants'
import { diff, filterObject, pick } from '@/lib/utils'
import UserForm from '@/components/kb/panels/users/form/UserForm'

const { CANCEL, SAVE } = LABELS.BUTTON

// Common field definitions
export const USER_FIELDS = {
  EDITABLE: ['affiliation', 'email', 'firstName', 'lastName', 'role'],
  REQUIRED_BASE: ['affiliation', 'email', 'firstName', 'lastName', 'role', 'username'],
  REQUIRED_ADD: ['affiliation', 'email', 'firstName', 'lastName', 'password', 'role', 'username'],
  ADD_SUBMIT: ['affiliation', 'email', 'firstName', 'lastName', 'password', 'role', 'username'],
}

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

export const createModalContent = (FormComponent, handleFormChange, users, isEdit, formKey) => {
  const UserModalContent = (user, originalUser = null) => {
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
  }

  return UserModalContent
}

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

export const processAddUserData = user => {
  return filterObject(
    pick(user, USER_FIELDS.ADD_SUBMIT),
    (key, value) => value && value.trim() !== ''
  )
}

// Shared hook utilities to eliminate duplication
export const createSharedHandlers = (updateModalData, closeModal, isEdit) => {
  const handleFormChange = (updatedUser, originalUser) => {
    const formChangeHandler = createFormChangeHandler(updateModalData, isEdit)
    return formChangeHandler(updatedUser, originalUser)
  }

  const handleCancel = () => {
    closeModal()
  }

  return { handleCancel, handleFormChange }
}

export const createSharedContent = (handleFormChange, users, isEdit) => {
  const formKey = isEdit ? 'edit-user-form' : 'add-user-form'

  return modalData => {
    const modalContent = createModalContent(UserForm, handleFormChange, users, isEdit, formKey)
    return modalContent(modalData.user, modalData.originalUser)
  }
}
