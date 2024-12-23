import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

const AlertContentText = ({ sx, text }) => {
  const theme = useTheme()

  return (
    <Typography
      id="modal-message"
      variant="h6"
      component="h3"
      sx={{ ...sx, color: theme.palette.common.black }}
    >
      {text}
    </Typography>
  )
}

export default AlertContentText
