import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const ErrorContent = ({ error }) => {
  const theme = useTheme()

  return (
    <Box>
      <Typography variant='body1'>{error.message}</Typography>
      <Typography
        id='modal-error-detail'
        variant='h6'
        component='h3'
        sx={{ color: theme.palette.common.black, mt: 2 }}
      >
        {error.url}
      </Typography>
    </Box>
  )
}

export default ErrorContent
