import { Box, Button, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

const ModalConfirm = ({ modalAlert }) => {
  const theme = useTheme()

  return (
    <>
      <Typography
        id="modal-message"
        variant="h6"
        component="h3"
        sx={{ color: theme.palette.common.black, mt: 2 }}
      >
        {modalAlert.message}
      </Typography>
      {modalAlert.detail && (
        <Typography id="modal-message-detail" sx={{ mt: 1 }}>
          {modalAlert.detail}
        </Typography>
      )}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        {modalAlert.choices.map((choice, index) => (
          <Button
            key={index}
            onClick={() => {
              modalAlert.onChoice(choice)
            }}
            sx={{
              flex: 1,
              color: theme.palette.primary.main,
              fontSize: "1.25rem",
              fontWeight: "bold",
              // mx: 0.5,
            }}
          >
            {choice}
          </Button>
        ))}
      </Box>
    </>
  )
}

export default ModalConfirm
