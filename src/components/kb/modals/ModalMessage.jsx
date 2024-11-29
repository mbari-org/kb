import { use } from "react"

import { Box, Button, Modal, Typography } from "@mui/material"

import ModalContext from "@/contexts/modal/ModalContext"

const ModalMessage = () => {
  const { modalMessage, setModalMessage } = use(ModalContext)

  const onClose = () => {
    setModalMessage(null)
  }

  return (
    <Modal
      open={modalMessage}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {modalMessage}
        </Typography>
        <Button onClick={onClose}>Close</Button>
      </Box>
    </Modal>
  )
}

export default ModalMessage
