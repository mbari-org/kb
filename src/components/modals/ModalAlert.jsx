import { Box, Card, CardActions, CardContent, Modal } from "@mui/material"

const ModalAlert = ({ modalAlert }) => {
  return (
    <Modal
      aria-labelledby="modal-alert"
      aria-describedby="modal-alert-description"
      open
    >
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          // minHeight: "300px",
        }}
      >
        <Card sx={{ p: 2, pb: 0 }}>
          <CardContent>
            <modalAlert.Title />
            <modalAlert.Content />
          </CardContent>
          <CardActions style={{ display: "flex", justifyContent: "center" }}>
            <modalAlert.Choices />
          </CardActions>
        </Card>
      </Box>
    </Modal>
  )
}

export default ModalAlert
