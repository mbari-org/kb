import { use } from 'react'

import { Box, Button, Stack } from '@mui/material'

import AppModalContext from '@/contexts/app/AppModalContext'
import UserContext from '@/contexts/user/UserContext'

import logoutModal from '@/text/config/logoutModal.json'

const LogoutActions = () => {
  const { closeModal } = use(AppModalContext)
  const { logout } = use(UserContext)

  return (
    <Stack direction='row' spacing={1} sx={{ position: 'relative', width: '100%' }}>
      <Box sx={{ flex: 1 }} />
      <Button
        onClick={() => {
          closeModal()
          logout()
        }}
        color='cancel'
        variant='contained'
      >
        {logoutModal.BUTTON.LOGOUT}
      </Button>
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={closeModal} variant='contained'>
          {logoutModal.BUTTON.NO}
        </Button>
      </Box>
    </Stack>
  )
}

export default LogoutActions
