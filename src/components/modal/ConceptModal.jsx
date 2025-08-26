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
import ProcessingMessage from '@/components/common/ProcessingMessage'

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
              onClick={() => closeModal(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
              disabled={isProcessing}
            >
              <IoCloseSharp />
            </IconButton>
            <CardHeader title={title} />
            <CardContent sx={{ pb: 0, pt: 0, position: 'relative' }}>{content}</CardContent>
            <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
              {actions}
            </CardActions>
            {isProcessing && <ProcessingMessage message={processingMessage} />}
          </Card>
        </Box>
      </Fade>
    </Modal>
  )
}

export default ConceptModal
