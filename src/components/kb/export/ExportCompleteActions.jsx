import { use } from 'react'

import { Button } from '@mui/material'

import CONFIG from '@/text'
import AppModalContext from '@/contexts/app/AppModalContext'

const { DISMISS } = CONFIG.COMMON.EXPORT

const ExportCompleteActions = () => {
  const { closeModal } = use(AppModalContext)

  return (
    <Button onClick={closeModal} variant='contained'>
      {DISMISS}
    </Button>
  )
}

export default ExportCompleteActions
