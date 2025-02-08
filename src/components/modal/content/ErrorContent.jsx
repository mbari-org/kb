import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import { createTextContent } from "@/components/modal/factory"

const ErrorContent = ({ error }) => {
  const theme = useTheme()

  const modalTextMessage = createTextContent({
    sx: { mt: 2, mb: 2 },
    text: error.message,
    type: "error",
  })
  return (
    <>
      {modalTextMessage}
      <Typography
        id="modal-error-detail"
        variant="h6"
        component="h3"
        sx={{ color: theme.palette.common.black, mt: 2 }}
      >
        {error.url}
      </Typography>
    </>
  )
}

export default ErrorContent
