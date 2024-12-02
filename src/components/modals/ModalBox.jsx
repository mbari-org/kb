import { Box, Modal } from "@mui/material"

const ModalBox = ({ children, onClose, open }) => {
  return (
    <Modal
      aria-labelledby="modal-box-title"
      aria-describedby="modal-box-description"
      onClose={onClose}
      open={open}
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
        {children}
      </Box>
    </Modal>
  )
}

export default ModalBox
