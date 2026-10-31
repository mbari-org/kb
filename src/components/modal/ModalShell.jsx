import { IoCloseSharp } from 'react-icons/io5'

import { Box, Card, CardActions, CardContent, CardHeader, Fade, IconButton, Modal } from '@mui/material'

import ProcessingMsg from '@/components/common/ProcessingMessage'

const renderSlot = slot => (typeof slot === 'function' ? slot() : slot)

const ModalShell = ({
  title,
  content,
  actions,
  closeModal,
  focusClose = false,
  processing = false,
  processingMessage,
  minWidth = 500,
  maxWidth,
  width,
  contentSx,
  ariaLabelledBy = 'modal-alert',
  backdropClose = false,
}) => {
  const isProcessing = Boolean(processing)

  return (
    <Modal
      aria-labelledby={ariaLabelledBy}
      aria-describedby={`${ariaLabelledBy}-description`}
      open
      onClose={backdropClose ? () => closeModal(false) : undefined}
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
          <Card sx={{ p: 1, pb: 0, position: 'relative', minWidth, maxWidth, width }}>
            <IconButton
              autoFocus={focusClose}
              aria-label='close'
              onClick={() => closeModal(false)}
              sx={{ position: 'absolute', right: 0, top: 0 }}
              disabled={isProcessing}
            >
              <IoCloseSharp />
            </IconButton>
            <CardHeader title={renderSlot(title)} />
            <CardContent sx={[{ pb: 0, pt: 0, position: 'relative' }, contentSx]}>{renderSlot(content)}</CardContent>
            {actions && (
              <CardActions style={{ display: 'flex', justifyContent: 'center' }}>{renderSlot(actions)}</CardActions>
            )}
            {isProcessing && <ProcessingMsg message={processingMessage} />}
          </Card>
        </Box>
      </Fade>
    </Modal>
  )
}

export default ModalShell
