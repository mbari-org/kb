import { use } from 'react'
import { Box, CircularProgress, Fade, Modal, Typography } from '@mui/material'

import AppModalContext from '@/contexts/app/AppModalContext'

const KbLoading = () => {
  const { processing, processingMessage } = use(AppModalContext)

  if (!processing) return null

  const message = processingMessage

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
          <Box
            sx={{
              alignItems: 'center',
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 6,
              display: 'flex',
              gap: 2,
              px: 3,
              py: 2,
            }}
          >
            <CircularProgress size={24} />
            <Typography variant='subtitle1'>{message}</Typography>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default KbLoading
