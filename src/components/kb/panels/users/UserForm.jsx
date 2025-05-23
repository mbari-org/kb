import { Box, TextField, MenuItem } from '@mui/material'

import { ROLES } from '@/lib/constants'

const UserForm = ({ user, onChange, isEdit = false }) => {
  const handleChange = field => event => {
    onChange({
      ...user,
      [field]: event.target.value,
    })
  }

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label='Username'
        value={user.username || ''}
        onChange={handleChange('username')}
        disabled={isEdit}
        fullWidth
        required
      />
      <TextField
        select
        label='Role'
        value={user.role || ''}
        onChange={handleChange('role')}
        fullWidth
        required
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
        fullWidth
        required
      />
      <TextField
        label='First Name'
        value={user.firstName || ''}
        onChange={handleChange('firstName')}
        fullWidth
        required
      />
      <TextField
        label='Last Name'
        value={user.lastName || ''}
        onChange={handleChange('lastName')}
        fullWidth
        required
      />
      <TextField
        label='Email'
        value={user.email || ''}
        onChange={handleChange('email')}
        fullWidth
        required
        type='email'
      />
    </Box>
  )
}

export default UserForm
