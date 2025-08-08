import { use } from 'react'
import { IoCloseSharp } from 'react-icons/io5'

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Fade,
  IconButton,
  Modal,
} from '@mui/material'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

const ConceptModal = () => {
  const { modal, closeModal, processing } = use(ConceptModalContext)

  if (!modal) {
    return null
  }

  const { actions, content, title, minWidth = 500 } = modal

  const isProcessing = Boolean(processing)
  const processingMessage = typeof processing === 'string' ? processing : 'Processing...'

  return (
    <Modal
      aria-labelledby='modal-alert'
      aria-describedby='modal-alert-description'
      open
      closeAfterTransition
    >
      <Fade in={true} timeout={500}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            mt: 10,
          }}
        >
          <Card sx={{ p: 1, pb: 0, position: 'relative', minWidth }}>
            <IconButton
              aria-label='close'
              onClick={() => closeModal()}
              sx={{ position: 'absolute', right: 8, top: 8 }}
              disabled={isProcessing}
            >
              <IoCloseSharp />
            </IconButton>
            <CardHeader title={title()} />
            <CardContent sx={{ pb: 0, pt: 0, position: 'relative' }}>
              {content()}
            </CardContent>
            <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
              {actions()}
            </CardActions>

            {isProcessing && (
              <Box
                className='kb-modal-processing-overlay'
                sx={{
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  bottom: 0,
                  color: 'white',
                  display: 'flex',
                  fontSize: 16,
                  fontWeight: 500,
                  inset: 0,
                  justifyContent: 'center',
                  left: 0,
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  zIndex: 2,
                }}
              >
                <Box sx={{
                  alignItems: 'center',
                  display: 'flex',
                  gap: 1,
                }}>
                  <span className='h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent' />
                  <span>{processingMessage}</span>
                </Box>
              </Box>
            )}
          </Card>
        </Box>
      </Fade>
    </Modal>
  )
}

export default ConceptModal
