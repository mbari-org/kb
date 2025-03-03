import { use } from 'react'
import { IoClose } from 'react-icons/io5'

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

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext, { MODAL_X } from '@/contexts/modal/ModalContext'

const KbModal = () => {
  const { modal, setModal } = use(ModalContext)
  const { confirmReset } = use(ConceptContext)

  if (!modal) {
    return null
  }

  const { Actions, Content, Title } = modal

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
          <Card sx={{ p: 2, pb: 0, position: 'relative' }}>
            {!confirmReset && (
              <IconButton
                aria-label='close'
                onClick={() => setModal(MODAL_X)}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <IoClose />
              </IconButton>
            )}
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

export default KbModal
