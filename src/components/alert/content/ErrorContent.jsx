import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import { createTextContent } from "@/components/factory"

const ErrorContent = ({ error }) => {
  const theme = useTheme()

  const alertTextMessage = createTextContent({
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

export default ErrorContent
