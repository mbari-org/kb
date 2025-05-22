import { use, useCallback, useState } from 'react'

import { Box, FormControl, TextField, MenuItem } from '@mui/material'

import ModalContext from '@/contexts/modal/ModalContext'

import { ROLES } from '@/lib/constants'

export const ADD_USER_FORM_ID = 'add-user-form'

const REQUIRED_FIELDS = ['username', 'role', 'affiliation', 'firstName', 'lastName', 'email']

// Basic email validation regex
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

const AddUserContent = () => {
  const { modalData, setModalData } = use(ModalContext)

  const { user, existingUsers } = modalData

  const [formUser, setFormUser] = useState(user)
  const [modifiedFields, setModifiedFields] = useState({
    username: false,
    role: false,
    affiliation: false,
    firstName: false,
    lastName: false,
    email: false,
  })
  const [emailError, setEmailError] = useState(false)
  const [usernameError, setUsernameError] = useState(false)

  const handleChange = useCallback(
    (field, value) => {
      const updatedUser = {
        ...formUser,
        [field]: value,
      }
      setFormUser(updatedUser)

      const fieldIsModified = value !== ''
      const updatedModifiedFields = { ...modifiedFields, [field]: fieldIsModified }
      setModifiedFields(updatedModifiedFields)

      // Validate email format if email field is modified
      if (field === 'email') {
        const isValidEmail = EMAIL_REGEX.test(value)
        setEmailError(fieldIsModified && !isValidEmail)
      }

      // Validate username uniqueness if username field is modified
      if (field === 'username') {
        const isUsernameTaken = existingUsers.some(user => user.username === value)
        setUsernameError(fieldIsModified && isUsernameTaken)
      }

      const allRequiredFieldsFilled = REQUIRED_FIELDS.every(field => {
        if (field === 'email') {
          return (
            updatedUser[field] &&
            updatedUser[field].trim() !== '' &&
            EMAIL_REGEX.test(updatedUser[field])
          )
        }
        if (field === 'username') {
          return (
            updatedUser[field] &&
            updatedUser[field].trim() !== '' &&
            !existingUsers.some(user => user.username === updatedUser[field])
          )
        }
        return updatedUser[field] && updatedUser[field].trim() !== ''
      })
      const modified = allRequiredFieldsFilled

      setModalData(prev => ({ ...prev, user: updatedUser, modified }))
    },
    [formUser, modifiedFields, setModalData, existingUsers]
  )

  const handleFieldChange = useCallback(
    field => event => {
      handleChange(field, event.target.value)
    },
    [handleChange]
  )

  return (
    <Box component='form' id={ADD_USER_FORM_ID}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <TextField
          autoFocus
          label='Username'
          name='username'
          onChange={handleFieldChange('username')}
          required
          value={formUser.username}
          error={usernameError}
          helperText={usernameError ? 'Username already exists' : ''}
        />
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <TextField
          label='Role'
          name='role'
          select
          required
          value={formUser.role}
          onChange={handleFieldChange('role')}
        >
          {Object.values(ROLES).map(role => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <TextField
          label='Affiliation'
          name='affiliation'
          onChange={handleFieldChange('affiliation')}
          required
          value={formUser.affiliation}
        />
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <TextField
          label='First Name'
          name='firstName'
          onChange={handleFieldChange('firstName')}
          required
          value={formUser.firstName}
        />
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <TextField
          label='Last Name'
          name='lastName'
          onChange={handleFieldChange('lastName')}
          required
          value={formUser.lastName}
        />
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <TextField
          label='Email'
          name='email'
          type='email'
          onChange={handleFieldChange('email')}
          required
          value={formUser.email}
          error={emailError}
          helperText={emailError ? 'Please enter a valid email address' : ''}
        />
      </FormControl>
    </Box>
  )
}

export default AddUserContent
