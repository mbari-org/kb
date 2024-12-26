import { Box, Modal } from "@mui/material"

const ModalAlert = ({ modalAlert }) => {
  return (
    <Modal
      aria-labelledby="modal-alert"
      aria-describedby="modal-alert-description"
      open
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          left: "50%",
          position: "absolute",
          top: "33%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          p: 4,
          pb: 1,
        }}
      >
        <modalAlert.Title />
        <modalAlert.Content />
        <modalAlert.Choices />
      </Box>
    </Modal>
  )
}

export default ModalAlert
