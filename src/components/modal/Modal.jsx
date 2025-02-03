import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Fade,
  Modal as MuiModal,
} from "@mui/material"

const Modal = ({ modal }) => {
  const { Actions, Content, Title } = modal

  return (
    <MuiModal
      aria-labelledby="modal-alert"
      aria-describedby="modal-alert-description"
      open
      closeAfterTransition
    >
      <Fade in={true} timeout={500}>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            mt: 10,
          }}
        >
          <Card sx={{ p: 2, pb: 0 }}>
            <CardHeader title={<Title />} />
            <CardContent sx={{ pb: 0, pt: 0 }}>
              <Content />
            </CardContent>
            <CardActions style={{ display: "flex", justifyContent: "center" }}>
              <Actions />
            </CardActions>
          </Card>
        </Box>
      </Fade>
    </MuiModal>
  )
}

export default Modal
