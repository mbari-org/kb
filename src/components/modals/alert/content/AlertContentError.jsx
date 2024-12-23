import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import { createAlertContentText } from "../components"

const AlertContentError = ({ error }) => {
  const theme = useTheme()

  const alertTextMessage = createAlertContentText({
    sx: { mt: 2, mb: 2 },
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

export default AlertContentError
