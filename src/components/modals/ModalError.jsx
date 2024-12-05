import { Box, Button, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

const ModalError = (modalAlert, onClose) => {
  const theme = useTheme()
  return (
    <>
      <Typography
        id="modal-message"
        variant="h6"
        component="h3"
        sx={{ color: theme.palette.error.main, mt: 2 }}
      >
        {modalAlert.message}
      </Typography>
      {modalAlert.detail && (
        <Typography id="modal-message-detail" sx={{ mt: 1 }}>
          {modalAlert.detail}
        </Typography>
      )}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            fontWeight: "bold",
            color: theme.palette.error.main,
          }}
        >
          Close
        </Button>
      </Box>
    </>
  )
}

export default ModalError
