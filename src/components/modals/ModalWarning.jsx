import { Box, Button, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

const ModalWarning = ({ modalAlert, onClose }) => {
  const theme = useTheme()

  return (
    <>
      <Typography
        id="modal-message"
        variant="h6"
        component="h3"
        sx={{ color: theme.palette.primary.main, mt: 2 }}
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
            color: theme.palette.primary.main,
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          Close
        </Button>
      </Box>
    </>
  )
}

export default ModalWarning
