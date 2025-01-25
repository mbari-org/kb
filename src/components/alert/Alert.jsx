import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Fade,
  Modal,
} from "@mui/material"

const Alert = ({ alert }) => {
  const { Actions, Content, Title } = alert

  return (
    <Modal
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
    </Modal>
  )
}

export default Alert
