import { memo, useCallback, useState, useEffect } from 'react'
import { Box, TextField, MenuItem } from '@mui/material'

import { EMAIL_REGEX, USER_ROLES } from '@/lib/constants'
import useDebounce from '@/hooks/useDebounce'

const UserForm = memo(({ user, original, onChange, isEdit = false, users }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const [touched, setTouched] = useState({})
  const [localUser, setLocalUser] = useState(user)

  useEffect(() => {
    setLocalUser(user)
  }, [user])

  const debouncedOnChange = useDebounce(onChange, 300)

  const handleChange = field => event => {
    const value = event.target.value
    const updatedUser = {
      ...localUser,
      [field]: value,
    }

    setLocalUser(updatedUser)

    if (field === 'password') {
      setShowConfirm(true)
    }

    debouncedOnChange(updatedUser, original)
  }

  const handleBlur = field => () => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const isUsernameUnique = useCallback(
    username => isEdit || !username || !users.some(u => u.username === username),
    [users, isEdit]
  )

  const showError = field => {
    if (!touched[field]) return false
    if (field === 'email') {
      return !localUser.email || !EMAIL_REGEX.test(localUser.email)
    }
    if (field === 'username' && !isEdit) {
      return !localUser.username || !isUsernameUnique(localUser.username)
    }
    if (field === 'password') {
      if (isEdit) return false
      return !localUser.password
    }
    if (field === 'confirmPassword') {
      if (isEdit && !localUser.password) return false
      if (!localUser.confirmPassword) return true
      return localUser.password !== localUser.confirmPassword
    }
    return !localUser[field]
  }

  const getHelperText = field => {
    if (!showError(field)) return ''
    if (field === 'email') return 'Valid email is required'
    if (field === 'username' && !isEdit) return 'Username already exists'
    if (field === 'password' && !isEdit) return 'Password is required'
    if (field === 'confirmPassword') {
      if (!localUser.confirmPassword) return 'Please confirm your password'
      return 'Passwords do not match'
    }
    return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
  }

  const showConfirmPassword = !isEdit || showConfirm

  return (
    <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <TextField
        label='Username'
        value={localUser.username || ''}
        onChange={handleChange('username')}
        onBlur={handleBlur('username')}
        disabled={isEdit}
        fullWidth
        required
        error={showError('username')}
        helperText={getHelperText('username')}
      />
      <TextField
        label='Password'
        value={localUser.password || ''}
        onChange={handleChange('password')}
        onBlur={handleBlur('password')}
        fullWidth
        required={!isEdit}
        error={showError('password')}
        helperText={getHelperText('password')}
        placeholder={isEdit ? 'Leave blank to keep current password' : ''}
      />
      {showConfirmPassword && (
        <TextField
          label='Confirm Password'
          value={localUser.confirmPassword || ''}
          onChange={handleChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
          fullWidth
          required={!isEdit || (isEdit && localUser.password)}
          error={showError('confirmPassword')}
          helperText={getHelperText('confirmPassword')}
        />
      )}
      <TextField
        select
        label='Role'
        value={localUser.role || ''}
        onChange={handleChange('role')}
        onBlur={handleBlur('role')}
        fullWidth
        required
        error={showError('role')}
        helperText={getHelperText('role')}
      >
        {Object.values(USER_ROLES).map(role => (
          <MenuItem key={role} value={role}>
            {role}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label='Affiliation'
        value={localUser.affiliation || ''}
        onChange={handleChange('affiliation')}
        onBlur={handleBlur('affiliation')}
        fullWidth
        required
        error={showError('affiliation')}
        helperText={getHelperText('affiliation')}
      />
      <TextField
        label='First Name'
        value={localUser.firstName || ''}
        onChange={handleChange('firstName')}
        onBlur={handleBlur('firstName')}
        fullWidth
        required
        error={showError('firstName')}
        helperText={getHelperText('firstName')}
      />
      <TextField
        label='Last Name'
        value={localUser.lastName || ''}
        onChange={handleChange('lastName')}
        onBlur={handleBlur('lastName')}
        fullWidth
        required
        error={showError('lastName')}
        helperText={getHelperText('lastName')}
      />
      <TextField
        label='Email'
        value={localUser.email || ''}
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
})

UserForm.displayName = 'UserForm'

export default UserForm
