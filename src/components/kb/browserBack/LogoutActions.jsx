import { use } from 'react'

import { Button, Stack } from '@mui/material'

import ConceptModalContext from '@/contexts/modal/ConceptModalContext'

const LogoutActions = () => {
  const { closeModal } = use(ConceptModalContext)

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
