import { Box, TextField, MenuItem } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { EMAIL_REGEX, USER_ROLES } from '@/lib/constants'

const REQUIRED_FIELDS = ['username', 'role', 'affiliation', 'firstName', 'lastName', 'email']
const REQUIRED_FIELDS_ADD = [...REQUIRED_FIELDS, 'password', 'confirmPassword']

const UserForm = ({ user, onChange, isEdit = false, existingUsers = [] }) => {
  const [touched, setTouched] = useState({})
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = field => event => {
    const newValue = event.target.value
    const updatedUser = {
      ...user,
      [field]: newValue,
    }
    if (field === 'password') {
      setShowConfirm(true)
    }
    onChange(updatedUser)
  }

  const handleBlur = field => () => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const isUsernameUnique = useCallback(
    username => {
      if (!username) return true
      return !existingUsers.some(u => u.username === username)
    },
    [existingUsers]
  )

  const isValid = useMemo(() => {
    const isEmailValid = EMAIL_REGEX.test(user.email || '')
    const requiredFields = isEdit ? REQUIRED_FIELDS : REQUIRED_FIELDS_ADD
    const allFieldsFilled = requiredFields.every(field => {
      const value = user[field] || ''
      return value.trim() !== ''
    })
    const usernameUnique = isUsernameUnique(user.username)
    const passwordsMatch = isEdit
      ? user.password
        ? user.password === user.confirmPassword
        : true
      : user.password === user.confirmPassword
    return allFieldsFilled && isEmailValid && usernameUnique && passwordsMatch
  }, [user, isUsernameUnique, isEdit])

  const hasChanges = useMemo(() => {
    if (!isEdit) return true
    const fieldsToCompare = ['role', 'affiliation', 'firstName', 'lastName', 'email']
    return (
      fieldsToCompare.some(field => user[field] !== user.originalUser?.[field]) ||
      (user.password && user.password !== user.originalUser?.password)
    )
  }, [user, isEdit])

  useEffect(() => {
    if (user.isValid !== isValid || user.hasChanges !== hasChanges) {
      onChange({ ...user, isValid, hasChanges })
    }
  }, [isValid, hasChanges, user, onChange])

  const showError = field => {
    if (!touched[field]) return false
    if (field === 'email') {
      return !user.email || !EMAIL_REGEX.test(user.email)
    }
    if (field === 'username' && !isEdit) {
      return !user.username || !isUsernameUnique(user.username)
    }
    if (field === 'password') {
      if (isEdit) return false
      return !user.password
    }
    if (field === 'confirmPassword') {
      if (isEdit && !user.password) return false
      if (!user.confirmPassword) return true
      return user.password !== user.confirmPassword
    }
    return !user[field]
  }

  const getHelperText = field => {
    if (!showError(field)) return ''
    if (field === 'email') return 'Valid email is required'
    if (field === 'username' && !isEdit) return 'Username already exists'
    if (field === 'password' && !isEdit) return 'Password is required'
    if (field === 'confirmPassword') {
      if (!user.confirmPassword) return 'Please confirm your password'
      return 'Passwords do not match'
    }
    return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
  }

  const showConfirmPassword = !isEdit || showConfirm

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
        label='Password'
        type='password'
        value={user.password || ''}
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
          type='password'
          value={user.confirmPassword || ''}
          onChange={handleChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
          fullWidth
          required={!isEdit || (isEdit && user.password)}
          error={showError('confirmPassword')}
          helperText={getHelperText('confirmPassword')}
        />
      )}
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
        {Object.values(USER_ROLES).map(role => (
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
