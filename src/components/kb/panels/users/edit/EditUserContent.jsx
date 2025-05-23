import { use } from 'react'
import { Box, TextField, MenuItem } from '@mui/material'

import ModalContext from '@/contexts/modal/ModalContext'
import { ROLES } from '@/lib/constants'

const EditUserContent = () => {
  const { modalData, setModalData } = use(ModalContext)
  const { user } = modalData

  const handleChange = field => event => {
    setModalData({
      ...modalData,
      user: {
        ...user,
        [field]: event.target.value,
      },
    })
  }

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label='Username' value={user.username} disabled fullWidth />
      <TextField select label='Role' value={user.role} onChange={handleChange('role')} fullWidth>
        {Object.values(ROLES).map(role => (
          <MenuItem key={role} value={role}>
            {role}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label='Affiliation'
        value={user.affiliation}
        onChange={handleChange('affiliation')}
        fullWidth
      />
      <TextField
        label='First Name'
        value={user.firstName}
        onChange={handleChange('firstName')}
        fullWidth
      />
      <TextField
        label='Last Name'
        value={user.lastName}
        onChange={handleChange('lastName')}
        fullWidth
      />
      <TextField label='Email' value={user.email} onChange={handleChange('email')} fullWidth />
    </Box>
  )
}

export default EditUserContent
