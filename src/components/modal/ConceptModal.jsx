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

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/modal/concept/ConceptModalContext'

const ConceptModal = () => {
  const { modal, closeModal } = use(ConceptModalContext)
  const { confirmReset } = use(ConceptContext)

  if (!modal) {
    return null
  }

  const { Actions, Content, Title, minWidth = 500 } = modal

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
            {!confirmReset && (
              <IconButton
                aria-label='close'
                onClick={() => closeModal()}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <IoCloseSharp />
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

export default ConceptModal
