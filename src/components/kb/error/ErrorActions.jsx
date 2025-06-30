import { use } from 'react'

import { Button } from '@mui/material'

import AppModalContext from '@/contexts/modal/app/AppModalContext'

const ErrorActions = () => {
  const { closeModal } = use(AppModalContext)

  return (
    <Button onClick={closeModal} variant='contained'>
      OK
    </Button>
  )
}

export default ErrorActions
