import { use } from 'react'

import { Button, Stack } from '@mui/material'

import AppModalContext from '@/contexts/app/AppModalContext'
import UserContext from '@/contexts/user/UserContext'

const LogoutActions = () => {
  const { closeModal } = use(AppModalContext)
  const { logout } = use(UserContext)

  return (
    <Stack direction='row' spacing={1}>
      <Button onClick={closeModal} variant='outlined'>
        Cancel
      </Button>
      <Button
        onClick={() => {
          closeModal()
          logout()
        }}
        variant='contained'
      >
        Logout
      </Button>
    </Stack>
  )
}

export default LogoutActions
