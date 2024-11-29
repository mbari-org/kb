import { use } from "react"

import { Box, Button, Modal, Typography } from "@mui/material"

import ModalContext from "@/contexts/modal/ModalContext"

const ModalMessage = () => {
  const { modalMessage, setModalMessage } = use(ModalContext)

  const onClose = () => {
    setModalMessage(null)
  }

  if (!modalMessage) {
    return null
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
          top: "33%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          id="modal-message-title"
          variant="h5"
          component="h2"
          sx={{ fontWeight: "bold" }}
        >
          {modalMessage.title}
        </Typography>
        <Typography
          id="modal-message"
          variant="h6"
          component="h3"
          sx={{ mt: 2 }}
        >
          {modalMessage.message}
        </Typography>
        {modalMessage.detail && (
          <Typography id="modal-message-detail" sx={{ mt: 1 }}>
            {modalMessage.detail}
          </Typography>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={onClose}>Close</Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default ModalMessage
