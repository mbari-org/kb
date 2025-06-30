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

import SystemModalContext from '@/contexts/modal/app/SystemModalContext'

const SystemModal = () => {
  const { modal, closeModal } = use(SystemModalContext)

  if (!modal) {
    return null
  }

  const { Actions, Content, Title, minWidth = 500 } = modal

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
            <CardHeader title={<Title />} />
            <CardContent sx={{ pb: 0, pt: 0 }}>
              <Content />
            </CardContent>
            <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
              <Actions />
            </CardActions>
          </Card>
        </Box>
      </Fade>
    </Modal>
  )
}

export default SystemModal
