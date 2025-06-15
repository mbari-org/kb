import { use } from 'react'

import { Box, Typography, Stack } from '@mui/material'

import ModalContext from '@/contexts/modal/ModalContext'

const LockUserContent = () => {
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

export default LockUserContent
