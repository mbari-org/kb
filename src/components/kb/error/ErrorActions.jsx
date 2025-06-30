import { use } from 'react'

import { Button } from '@mui/material'

import SystemModalContext from '@/contexts/modal/app/SystemModalContext'

const ErrorActions = () => {
  const { closeModal } = use(SystemModalContext)

  return (
    <Button onClick={closeModal} variant='contained'>
      OK
    </Button>
  )
}

export default ErrorActions
