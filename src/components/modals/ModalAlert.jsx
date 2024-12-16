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
        <modalAlert.Title />
        <modalAlert.Message />
        <modalAlert.Choices />
      </Box>
    </Modal>
  )
}

export default ModalAlert
