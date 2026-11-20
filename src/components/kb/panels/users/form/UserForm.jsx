import { memo, useCallback, useState, useEffect } from 'react'
import { Box, Stack, TextField, MenuItem } from '@mui/material'

import DiscardingAlert from '@/components/modal/actions/DiscardingAlert'

import { EMAIL_REGEX } from '@/lib/constants'
import { ROLES } from '@/lib/constants/roles.js'
import CONFIG from '@/lib/config'
import useDebounce from '@/lib/hooks/useDebounce'
import { useUsersModalDataContext } from '@/contexts/panels/users/modal'

const { AFFILIATION, CONFIRM_PASSWORD, EMAIL, FIRST_NAME, LAST_NAME, PASSWORD, ROLE, USERNAME } = CONFIG.FIELDS.USER
const { LABEL, PLACEHOLDER, VALIDATION } = CONFIG.PANELS.USERS.FORM

const FIELD_LABEL = {
  [AFFILIATION]: LABEL.AFFILIATION,
  [CONFIRM_PASSWORD]: LABEL.CONFIRM_PASSWORD,
  [EMAIL]: LABEL.EMAIL,
  [FIRST_NAME]: LABEL.FIRST_NAME,
  [LAST_NAME]: LABEL.LAST_NAME,
  [PASSWORD]: LABEL.PASSWORD,
  [ROLE]: LABEL.ROLE,
  [USERNAME]: LABEL.USERNAME,
}

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
    if (field === EMAIL) return VALIDATION.EMAIL
    if (field === USERNAME && !isEdit) return VALIDATION.USERNAME_EXISTS
    if (field === PASSWORD && !isEdit) return VALIDATION.PASSWORD
    if (field === CONFIRM_PASSWORD) {
      if (!localUser.confirmPassword) return VALIDATION.CONFIRM_PASSWORD
      return VALIDATION.PASSWORDS_MISMATCH
    }
    return VALIDATION.REQUIRED.replace('{field}', FIELD_LABEL[field])
  }

  const showConfirmPassword = !isEdit || showConfirm

  const { modalData } = useUsersModalDataContext()
  const isDiscard = !!modalData?.confirmDiscard

  return (
    <Stack spacing={2} sx={{ p: 1, width: 500 }}>
      <TextField
        label={LABEL.USERNAME}
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
        label={LABEL.PASSWORD}
        value={localUser.password || ''}
        onChange={handleChange(PASSWORD)}
        onBlur={handleBlur(PASSWORD)}
        fullWidth
        required={!isEdit}
        error={showError(PASSWORD)}
        helperText={getHelperText(PASSWORD)}
        placeholder={isEdit ? PLACEHOLDER.PASSWORD_EDIT : ''}
      />
      {showConfirmPassword && (
        <TextField
          label={LABEL.CONFIRM_PASSWORD}
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
        label={LABEL.ROLE}
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
        label={LABEL.AFFILIATION}
        value={localUser.affiliation || ''}
        onChange={handleChange(AFFILIATION)}
        onBlur={handleBlur(AFFILIATION)}
        fullWidth
        required
        error={showError(AFFILIATION)}
        helperText={getHelperText(AFFILIATION)}
      />
      <TextField
        label={LABEL.FIRST_NAME}
        value={localUser.firstName || ''}
        onChange={handleChange(FIRST_NAME)}
        onBlur={handleBlur(FIRST_NAME)}
        fullWidth
        required
        error={showError(FIRST_NAME)}
        helperText={getHelperText(FIRST_NAME)}
      />
      <TextField
        label={LABEL.LAST_NAME}
        value={localUser.lastName || ''}
        onChange={handleChange(LAST_NAME)}
        onBlur={handleBlur(LAST_NAME)}
        fullWidth
        required
        error={showError(LAST_NAME)}
        helperText={getHelperText(LAST_NAME)}
      />
      <TextField
        label={LABEL.EMAIL}
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
