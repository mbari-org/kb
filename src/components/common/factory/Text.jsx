import { Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const Text = ({ sx, text, color = 'common.black', id }) => {
  const theme = useTheme()

  return (
    <Typography
      id={id}
      sx={{
        color: theme.palette[color] || color,
        ...sx,
      }}
    >
      {text}
    </Typography>
  )
}

export default Text
