import { use } from 'react'

import { Box, Typography } from '@mui/material'

import ModalContext from '@/contexts/modal/ModalContext'

const DeleteUserContent = () => {
  const { modalData } = use(ModalContext)
  const { user } = modalData

  const fields = [
    { label: 'Username', value: user.username },
    { label: 'Role', value: user.role },
    { label: 'Affiliation', value: user.affiliation },
    { label: 'First Name', value: user.firstName },
    { label: 'Last Name', value: user.lastName },
    { label: 'Email', value: user.email },
  ]

  return (
    <Box sx={{ p: 2 }}>
      {fields.map(({ label, value }) => (
        <Box key={label} sx={{ mb: 2 }}>
          <Typography variant='subtitle2' color='text.secondary'>
            {label}
          </Typography>
          <Typography variant='body1'>{value}</Typography>
        </Box>
      ))}
    </Box>
  )
}

export default DeleteUserContent
