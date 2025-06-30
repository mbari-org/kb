import { use } from 'react'

import { Button } from '@mui/material'

import ConceptModalContext from '@/contexts/modal/ConceptModalContext'

const ErrorActions = () => {
  const { closeModal } = use(ConceptModalContext)

  return (
    <Button onClick={closeModal} variant='contained'>
      OK
    </Button>
  )
}

export default ErrorActions
