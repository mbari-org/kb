import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

const AlertTextMessage = ({ text }) => {
  const theme = useTheme()

  return (
    <Typography
      id="modal-message"
      variant="h6"
      component="h3"
      sx={{ color: theme.palette.common.black, mt: 2 }}
    >
      {text}
    </Typography>
  )
}

export default AlertTextMessage
