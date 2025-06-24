import { use } from 'react'

import { Button, Stack } from '@mui/material'

import AppModalContext from '@/contexts/modal/AppModalContext'

const LogoutActions = () => {
  const { closeModal } = use(AppModalContext)

  return (
    <Stack direction='row' spacing={1}>
      <Button onClick={closeModal} variant='outlined'>
        Cancel
      </Button>
      <Button
        onClick={() => {
          closeModal()
          window.location.href = '/logout'
        }}
        variant='contained'
      >
        Logout
      </Button>
    </Stack>
  )
}

export default LogoutActions
