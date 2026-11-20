import { memo, useCallback, useState, useEffect } from 'react'
import { Box, Stack, TextField, MenuItem } from '@mui/material'

import DiscardingAlert from '@/components/modal/actions/DiscardingAlert'

import { EMAIL_REGEX } from '@/lib/constants'
import { ROLES } from '@/lib/constants/roles.js'
import CONFIG from '@/lib/config'
import useDebounce from '@/lib/hooks/useDebounce'
import { useUsersModalDataContext } from '@/contexts/panels/users/modal'

const { AFFILIATION, CONFIRM_PASSWORD, EMAIL, FIRST_NAME, LAST_NAME, PASSWORD, ROLE, USERNAME } = CONFIG.FIELDS.USER

const USER_CHANGE_DEBOUNCE_MS = 300

const UserForm = memo(({ user, original, onChange, isEdit = false, users }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const [touched, setTouched] = useState({})
  const [localUser, setLocalUser] = useState(user)

  useEffect(() => {
    setLocalUser(user)
  }, [user])

  const debouncedOnChange = useDebounce(onChange, USER_CHANGE_DEBOUNCE_MS)

  const handleChange = field => event => {
    const value = event.target.value
    const updatedUser = {
      ...localUser,
      [field]: value,
    }

    setLocalUser(updatedUser)

    if (field === PASSWORD) {
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
    if (field === EMAIL) {
      return !localUser.email || !EMAIL_REGEX.test(localUser.email)
    }
    if (field === USERNAME && !isEdit) {
      return !localUser.username || !isUsernameUnique(localUser.username)
    }
    if (field === PASSWORD) {
      if (isEdit) return false
      return !localUser.password
    }
    if (field === CONFIRM_PASSWORD) {
      if (isEdit && !localUser.password) return false
      if (!localUser.confirmPassword) return true
      return localUser.password !== localUser.confirmPassword
    }
    return !localUser[field]
  }

  const getHelperText = field => {
    if (!showError(field)) return ''
    if (field === EMAIL) return 'Valid email is required'
    if (field === USERNAME && !isEdit) return 'Username already exists'
    if (field === PASSWORD && !isEdit) return 'Password is required'
    if (field === CONFIRM_PASSWORD) {
      if (!localUser.confirmPassword) return 'Please confirm your password'
      return 'Passwords do not match'
    }
    return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
  }

  const showConfirmPassword = !isEdit || showConfirm

  const { modalData } = useUsersModalDataContext()
  const isDiscard = !!modalData?.confirmDiscard

  return (
    <Stack spacing={2} sx={{ p: 1, width: 500 }}>
      <TextField
        label='Username'
        value={localUser.username || ''}
        onChange={handleChange(USERNAME)}
        onBlur={handleBlur(USERNAME)}
        disabled={isEdit}
        fullWidth
        required
        error={showError(USERNAME)}
        helperText={getHelperText(USERNAME)}
      />
      <TextField
        label='Password'
        value={localUser.password || ''}
        onChange={handleChange(PASSWORD)}
        onBlur={handleBlur(PASSWORD)}
        fullWidth
        required={!isEdit}
        error={showError(PASSWORD)}
        helperText={getHelperText(PASSWORD)}
        placeholder={isEdit ? 'Leave blank to keep current password' : ''}
      />
      {showConfirmPassword && (
        <TextField
          label='Confirm Password'
          value={localUser.confirmPassword || ''}
          onChange={handleChange(CONFIRM_PASSWORD)}
          onBlur={handleBlur(CONFIRM_PASSWORD)}
          fullWidth
          required={!isEdit || (isEdit && localUser.password)}
          error={showError(CONFIRM_PASSWORD)}
          helperText={getHelperText(CONFIRM_PASSWORD)}
        />
      )}
      <TextField
        select
        label='Role'
        value={localUser.role || ''}
        onChange={handleChange(ROLE)}
        onBlur={handleBlur(ROLE)}
        fullWidth
        required
        error={showError(ROLE)}
        helperText={getHelperText(ROLE)}
      >
        {Object.values(ROLES).map(role => (
          <MenuItem key={role} value={role}>
            {role}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label='Affiliation'
        value={localUser.affiliation || ''}
        onChange={handleChange(AFFILIATION)}
        onBlur={handleBlur(AFFILIATION)}
        fullWidth
        required
        error={showError(AFFILIATION)}
        helperText={getHelperText(AFFILIATION)}
      />
      <TextField
        label='First Name'
        value={localUser.firstName || ''}
        onChange={handleChange(FIRST_NAME)}
        onBlur={handleBlur(FIRST_NAME)}
        fullWidth
        required
        error={showError(FIRST_NAME)}
        helperText={getHelperText(FIRST_NAME)}
      />
      <TextField
        label='Last Name'
        value={localUser.lastName || ''}
        onChange={handleChange(LAST_NAME)}
        onBlur={handleBlur(LAST_NAME)}
        fullWidth
        required
        error={showError(LAST_NAME)}
        helperText={getHelperText(LAST_NAME)}
      />
      <TextField
        label='Email'
        value={localUser.email || ''}
        onChange={handleChange(EMAIL)}
        onBlur={handleBlur(EMAIL)}
        fullWidth
        required
        type='email'
        error={showError(EMAIL)}
        helperText={getHelperText(EMAIL)}
      />
      <Box sx={{ alignItems: 'center', display: 'flex', height: 60, justifyContent: 'center', pt: isDiscard ? 0.5 : 0 }}>
        {isDiscard ? <DiscardingAlert /> : null}
      </Box>
    </Stack>
  )
})

UserForm.displayName = 'UserForm'

export default UserForm
