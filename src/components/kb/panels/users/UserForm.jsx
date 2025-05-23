import { Box, TextField, MenuItem } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'

import { ROLES } from '@/lib/constants'

const REQUIRED_FIELDS = ['username', 'role', 'affiliation', 'firstName', 'lastName', 'email']
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

const UserForm = ({ user, onChange, isEdit = false, existingUsers = [] }) => {
  const [touched, setTouched] = useState({})

  const handleChange = field => event => {
    const newValue = event.target.value
    const updatedUser = {
      ...user,
      [field]: newValue,
    }
    onChange(updatedUser)
  }

  const handleBlur = field => () => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const isUsernameUnique = username => {
    if (!username) return true
    return !existingUsers.some(u => u.username === username)
  }

  const isValid = useMemo(() => {
    const isEmailValid = EMAIL_REGEX.test(user.email || '')
    const allFieldsFilled = REQUIRED_FIELDS.every(field => {
      const value = user[field] || ''
      return value.trim() !== ''
    })
    const usernameUnique = isUsernameUnique(user.username)
    return allFieldsFilled && isEmailValid && usernameUnique
  }, [user, existingUsers])

  useEffect(() => {
    if (user.isValid !== isValid) {
      onChange({ ...user, isValid })
    }
  }, [isValid, user, onChange])

  const showError = field => {
    if (!touched[field]) return false
    if (field === 'email') {
      return !user.email || !EMAIL_REGEX.test(user.email)
    }
    if (field === 'username' && !isEdit) {
      return !user.username || !isUsernameUnique(user.username)
    }
    return !user[field]
  }

  const getHelperText = field => {
    if (!showError(field)) return ''
    if (field === 'email') return 'Valid email is required'
    if (field === 'username' && !isEdit) return 'Username already exists'
    return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
  }

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label='Username'
        value={user.username || ''}
        onChange={handleChange('username')}
        onBlur={handleBlur('username')}
        disabled={isEdit}
        fullWidth
        required
        error={showError('username')}
        helperText={getHelperText('username')}
      />
      <TextField
        select
        label='Role'
        value={user.role || ''}
        onChange={handleChange('role')}
        onBlur={handleBlur('role')}
        fullWidth
        required
        error={showError('role')}
        helperText={getHelperText('role')}
      >
        {Object.values(ROLES).map(role => (
          <MenuItem key={role} value={role}>
            {role}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label='Affiliation'
        value={user.affiliation || ''}
        onChange={handleChange('affiliation')}
        onBlur={handleBlur('affiliation')}
        fullWidth
        required
        error={showError('affiliation')}
        helperText={getHelperText('affiliation')}
      />
      <TextField
        label='First Name'
        value={user.firstName || ''}
        onChange={handleChange('firstName')}
        onBlur={handleBlur('firstName')}
        fullWidth
        required
        error={showError('firstName')}
        helperText={getHelperText('firstName')}
      />
      <TextField
        label='Last Name'
        value={user.lastName || ''}
        onChange={handleChange('lastName')}
        onBlur={handleBlur('lastName')}
        fullWidth
        required
        error={showError('lastName')}
        helperText={getHelperText('lastName')}
      />
      <TextField
        label='Email'
        value={user.email || ''}
        onChange={handleChange('email')}
        onBlur={handleBlur('email')}
        fullWidth
        required
        type='email'
        error={showError('email')}
        helperText={getHelperText('email')}
      />
    </Box>
  )
}

export default UserForm
