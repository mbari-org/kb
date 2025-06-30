import { use } from 'react'

import { Button, Stack } from '@mui/material'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

const AddUserActions = () => {
  const { closeModal, modalData } = use(PanelModalContext)

  return (
    <Stack direction='row' spacing={1}>
      <Button onClick={closeModal} variant='outlined'>
        Cancel
      </Button>
      <Button
        onClick={() => {
          // Handle add user logic here
          console.log('Adding user:', modalData)
          closeModal()
        }}
        variant='contained'
      >
        Add User
      </Button>
    </Stack>
  )
}

export default AddUserActions
