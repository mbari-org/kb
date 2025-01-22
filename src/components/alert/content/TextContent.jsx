import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

const TextContent = ({ sx, text }) => {
  const theme = useTheme()

  return (
    <Typography
      id="modal-message"
      variant="h6"
      component="h4"
      sx={{ ...sx, color: theme.palette.common.black }}
    >
      {text}
    </Typography>
  )
}

export default TextContent
