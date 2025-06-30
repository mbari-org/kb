import { Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const Text = ({ sx, text }) => {
  const theme = useTheme()

  return (
    <Typography
      id='text-content'
      variant='h6'
      component='h4'
      sx={{ color: theme.palette.common.black, ...sx }}
    >
      {text}
    </Typography>
  )
}

export default Text
