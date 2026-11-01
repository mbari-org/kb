import { use } from 'react'
import { Box, Modal } from '@mui/material'

import AppModalContext from '@/contexts/app/AppModalContext'
import ProcessingMsg from '@/components/common/ProcessingMessage'

const KbLoading = () => {
  const { processing, processingMessage, suppressDisplay } = use(AppModalContext)

  if (!processing || suppressDisplay) return null

  return (
    <Modal open aria-labelledby='kb-processing-overlay'>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          outline: 'none',
        }}
      >
        <ProcessingMsg message={processingMessage} />
      </Box>
    </Modal>
  )
}

export default KbLoading
