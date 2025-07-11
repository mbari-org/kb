import { Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const Title = ({ title, type, sx = {} }) => {
  const theme = useTheme()

  let color
  switch (type) {
    case 'error':
      color = theme.palette.error.main
      break
    case 'warning':
      color = theme.palette.warning.main
      break
    default:
      color = theme.palette.common.black
  }

  return (
    <Typography
      id='modal-title'
      variant='h5'
      component='h2'
      sx={{
        borderBottom: '1px solid #000',
        color,
        fontWeight: 'bold',
        pb: 1,
        textAlign: 'center',
        width: '100%',
        ...sx,
      }}
    >
      {title}
    </Typography>
  )
}

export default Title
