import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

const AlertTextMessage = ({ error }) => {
  const theme = useTheme()

  return (
    <>
      <Typography
        id="modal-error-message"
        variant="h6"
        component="h3"
        sx={{ color: theme.palette.common.black, mt: 2 }}
      >
        {error.message}
      </Typography>
      <Typography
        id="modal-error-detail"
        variant="h6"
        component="h3"
        sx={{ color: theme.palette.common.black, mt: 2 }}
      >
        {error.detail}
      </Typography>
    </>
  )
}

export default AlertTextMessage
