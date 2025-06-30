import { use } from 'react'

import { Button, Stack } from '@mui/material'

import SystemModalContext from '@/contexts/modal/SystemModalContext'

const LogoutActions = () => {
  const { closeModal } = use(SystemModalContext)

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
