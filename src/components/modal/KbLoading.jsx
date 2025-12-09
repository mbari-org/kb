import { use } from 'react'
import { Box, Fade, Modal } from '@mui/material'

import AppModalContext from '@/contexts/app/AppModalContext'
import ProcessingMsg from '@/components/common/ProcessingMessage'

const KbLoading = () => {
  const { processing, processingMessage, suppressDisplay } = use(AppModalContext)

  if (!processing || suppressDisplay) return null

  return (
    <Modal open aria-labelledby='kb-processing-overlay' closeAfterTransition>
      <Fade in={true} timeout={200}>
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
      </Fade>
    </Modal>
  )
}

export default KbLoading
