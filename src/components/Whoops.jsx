import { ErrorBoundary } from 'react-error-boundary'
import { useNavigate } from 'react-router-dom'

import { Box, Button, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import whoopsImage from '@/assets/whoops.jpg'

const Whoops = ({ children }) => {
  const navigate = useNavigate()
  const theme = useTheme()

  const renderWhoops = ({ error, resetErrorBoundary }) => {
    console.log('error', error)

    const responseMessage = error.whoops
      ? `
      ${error.whoops?.title}: ${error.whoops?.message}
      ${error.whoops?.method}
      ${error.whoops?.url}
      `
      : 'An unexpected error occurred'

    const stack = error.original?.stack
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Box
          component='img'
          src={whoopsImage}
          alt='Whoops!'
          sx={{
            marginBottom: '20px',
            maxWidth: '350px',
            width: '50%',
          }}
        />
        {error.info && (
          <Typography
            sx={{
              fontSize: '18px',
              textAlign: 'center',
            }}
          >
            {error.info}
          </Typography>
        )}
        {!stack && (
          <Typography
            sx={{
              fontSize: '18px',
              textAlign: 'center',
            }}
          >
            {responseMessage}
          </Typography>
        )}
        {stack && (
          <Stack sx={{ mt: 4, width: '80%' }}>
            <Typography variant='body2'>{responseMessage}</Typography>
            <Typography
              variant='body2'
              component='pre'
              sx={{
                color: theme.palette.primary.cancel,
                fontFamily: 'monospace',
                fontSize: '12px',
                margin: '10px 0',
                maxHeight: '200px',
                overflow: 'auto',
                textAlign: 'left',
                whiteSpace: 'pre-wrap',
                width: '80%',
              }}
            >
              {stack}
            </Typography>
          </Stack>
        )}
        <Button onClick={() => resetErrorBoundary()} sx={{ fontSize: '24px', mt: 4 }}>
          Reset
        </Button>
      </Box>
    )
  }

  const handleReset = () => {
    navigate('/')
  }

  return (
    <ErrorBoundary fallbackRender={renderWhoops} onReset={handleReset}>
      {children}
    </ErrorBoundary>
  )
}

export default Whoops
