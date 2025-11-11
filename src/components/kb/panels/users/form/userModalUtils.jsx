import { Box, Stack, Typography } from '@mui/material'

import UserForm from '@/components/kb/panels/users/form/UserForm'

import { EMAIL_REGEX } from '@/lib/constants'
import { LABELS } from '@/lib/constants.js'

import { diff, filterObject, pick } from '@/lib/utils'

const { CANCEL, SAVE } = LABELS.BUTTON

const EDITABLE = ['affiliation', 'email', 'firstName', 'lastName', 'role']
const EDITABLE_ADD = [...EDITABLE, 'username']

export const createUserValidator =
  (isEdit = false) =>
    userData => {
      const requiredFields = isEdit ? EDITABLE_ADD : [...EDITABLE_ADD, 'password']

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

const createChangeDetector =
  (isEdit = false) =>
    (userData, original = null) => {
      if (!isEdit) {
      // For add mode, any non-empty field means changes
        const fieldsToCheck = [...EDITABLE_ADD, 'password']
        return fieldsToCheck.some(field => {
          const value = userData[field] || ''
          return value.trim() !== ''
        })
      }

      // For edit mode, compare with original
      const fieldsToCompare = EDITABLE
      return (
        fieldsToCompare.some(field => userData[field] !== original[field]) ||
      (userData.password && userData.password.trim() !== '')
      )
    }

const createFormChangeHandler = (updateModalData, isEdit = false) => {
  const validateUser = createUserValidator(isEdit)
  const calculateHasChanges = createChangeDetector(isEdit)

  return (updatedUser, original = null) => {
    const user = {
      ...updatedUser,
      password: updatedUser.password ?? '',
      confirmPassword: updatedUser.confirmPassword ?? '',
    }

    const isValid = validateUser(user)
    const hasChanges = calculateHasChanges(user, original)

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
          onClick: () => handleCommit(currentModalData.user, currentModalData.original),
        },
      ]

export const createModalContent = (handleFormChange, users, isEdit) => {
  const formKey = isEdit ? 'edit-user-form' : 'add-user-form'

  const UserModalContent = modalData => {
    const userWithConfirmPassword = {
      ...modalData.user,
      password: modalData.user.password ?? '',
      confirmPassword: modalData.user.confirmPassword ?? '',
    }

    return (
      <UserForm
        key={formKey}
        user={userWithConfirmPassword}
        original={modalData.original}
        onChange={handleFormChange}
        isEdit={isEdit}
        users={users}
      />
    )
  }

  UserModalContent.displayName = 'UserModalContent'
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

export const processEditUserData = (user, original) => {
  const hasFieldChanges = EDITABLE.some(field => user[field] !== original[field])
  const hasPasswordChange = user.password != null && user.password.trim() !== ''

  if (!hasFieldChanges && !hasPasswordChange) {
    return null // No changes
  }

  // Get updates, excluding empty password
  return filterObject(
    diff(pick(user, [...EDITABLE, 'password']), original),
    (key, value) => !(key === 'password' && (!value || value.trim() === ''))
  )
}

export const processAddUserData = user => {
  return filterObject(
    pick(user, [...EDITABLE_ADD, 'password']),
    (key, value) => value && value.trim() !== ''
  )
}

export const createHandlers = (updateModalData, closeModal, isEdit) => {
  // Create the form change handler once, not on every form change
  const formChangeHandler = createFormChangeHandler(updateModalData, isEdit)

  const handleFormChange = (updatedUser, original) => {
    return formChangeHandler(updatedUser, original)
  }

  const handleCancel = () => {
    closeModal()
  }

  return { handleCancel, handleFormChange }
}

// Lock user specific utilities
export const createLockUserActions = (handleCancel, handleLockToggle) => currentModalData => {
  const { user, isLastAdmin } = currentModalData
  const { CANCEL, LOCK, UNLOCK, CLOSE } = LABELS.BUTTON

  if (isLastAdmin) {
    return [
      {
        color: 'primary',
        disabled: false,
        label: CLOSE,
        onClick: handleCancel,
      },
    ]
  }

  return [
    {
      color: 'cancel',
      disabled: false,
      label: CANCEL,
      onClick: handleCancel,
    },
    {
      color: 'primary',
      disabled: false,
      label: user?.locked ? UNLOCK : LOCK,
      onClick: () => handleLockToggle(user),
    },
  ]
}

export const createLockUserTitle = currentModalData => {
  const { user, isLastAdmin } = currentModalData

  if (isLastAdmin) {
    return 'Can\'t Lock Last Admin'
  }

  return user?.locked ? 'Unlock User' : 'Lock User'
}

export const createLockUserContent = () => {
  const LockUserContent = currentModalData => {
    const { user, isLastAdmin } = currentModalData

    if (isLastAdmin) {
      return (
        <Stack spacing={0} sx={{ textAlign: 'center' }}>
          <Typography variant='body1' color='text.secondary'>
            You cannot lock the last unlocked admin.
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Please unlock another admin first.
          </Typography>
        </Stack>
      )
    }

    const fields = [
      { label: 'Username', value: user.username },
      { label: 'Role', value: user.role },
      { label: 'Affiliation', value: user.affiliation },
      { label: 'First Name', value: user.firstName },
      { label: 'Last Name', value: user.lastName },
      { label: 'Email', value: user.email },
    ]

    const lockedText = `A ${user.locked ? 'unlocked' : 'locked'} user will ${
      user.locked ? '' : 'not'
    } be able to log in to the Knowledge Base.`

    return (
      <Stack spacing={3}>
        <Stack spacing={2} sx={{ p: 2 }}>
          {fields.map(({ label, value }) => (
            <Box key={label}>
              <Typography variant='subtitle2' color='text.secondary'>
                {label}
              </Typography>
              <Typography variant='body1'>{value}</Typography>
            </Box>
          ))}
        </Stack>
        <Stack spacing={0} sx={{ textAlign: 'center' }}>
          <Typography variant='body1' color='text.secondary'>
            {lockedText}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            No other changes are made.
          </Typography>
        </Stack>
      </Stack>
    )
  }

  LockUserContent.displayName = 'LockUserContent'
  return LockUserContent
}
