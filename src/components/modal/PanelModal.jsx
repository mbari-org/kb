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

import ProcessingMsg from '@/components/common/ProcessingMessage'
import {
  usePanelModalOperationsContext,
} from '@/contexts/panel/modal/Context'

const PanelModal = ({ actions, content, titleComponent, closeModal, minWidth }) => {
  const { processing, processingMessage } = usePanelModalOperationsContext()

  const isProcessing = Boolean(processing)

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
              disabled={isProcessing}
              onClick={() => closeModal(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <IoCloseSharp />
            </IconButton>
            <CardHeader title={titleComponent} />
            <CardContent sx={{ pb: 0, pt: 0 }}>{content}</CardContent>
            <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
              {actions}
            </CardActions>
            {isProcessing && <ProcessingMsg message={processingMessage} />}
          </Card>
        </Box>
      </Fade>
    </Modal>
  )
}

export default PanelModal
