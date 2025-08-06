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

import AppModalContext from '@/contexts/app/AppModalContext'

const AppModal = () => {
  const { modal, closeModal } = use(AppModalContext)

  if (!modal) {
    return null
  }

  const { actions, content, title, minWidth = 500 } = modal

  return (
    <Modal
      aria-labelledby='system-modal-alert'
      aria-describedby='system-modal-alert-description'
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
            >
              <IoCloseSharp />
            </IconButton>
            <CardHeader title={title()} />
            <CardContent sx={{ pb: 0, pt: 0 }}>
              {content()}
            </CardContent>
            <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
              {actions()}
            </CardActions>
          </Card>
        </Box>
      </Fade>
    </Modal>
  )
}

export default AppModal
