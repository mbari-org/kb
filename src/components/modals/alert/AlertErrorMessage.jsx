import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import { createAlertTextMessage } from "./components"

const AlertErrorMessage = ({ error }) => {
  const theme = useTheme()

  const alertTextMessage = createAlertTextMessage({
    text: error.message,
    type: "error",
  })
  return (
    <>
      {alertTextMessage}
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

export default AlertErrorMessage
