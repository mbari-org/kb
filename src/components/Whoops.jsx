import { ErrorBoundary } from 'react-error-boundary'

import { Box, Button, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { clearStores } from '@/lib/local/store/clearStores'

import whoopsImage from '@/assets/whoops.jpg'

const Whoops = ({ children }) => {
  const theme = useTheme()

  // Using window.location.href bypasses the React error boundary
  const handleForcedLogout = () => {
    clearStores()
    window.location.href = '/kbeditor/'
  }

  const handleReset = () =>
    window.location.href = '/kbeditor/'

  const handleCopyInfo = async error => {
    const stack = error.original?.stack || error.stack
    const responseMessage = error.title
      ? `${error.title}: ${error.message}\n${error.details ? JSON.stringify(error.details, null, 2) : ''}`
      : 'An unexpected error occurred'

    const infoToCopy = `Error: ${responseMessage}\n\nStack Trace:\n${
      stack || 'No stack trace available'
    }`

    await navigator.clipboard.writeText(infoToCopy)
    alert('Error information copied to clipboard! Please include when reporting this issue.')
  }

  const renderWhoops = ({ error }) => {
    const responseMessage = error.title
      ? `
      ${error.title}: ${error.message}
      ${error.details ? `\nDetails: ${JSON.stringify(error.details, null, 2)}` : ''}
      `
      : 'An unexpected error occurred'

    const stack = error.original?.stack || error.stack
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
          <Stack sx={{ width: '80%' }}>
            <Typography variant='body1' sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              しまった!
            </Typography>
            <Typography variant='body2' sx={{ textAlign: 'center', fontWeight: 'bold', mt: 2 }}>
              💥 {responseMessage} 💥
            </Typography>
            <Typography variant='body2' sx={{ textAlign: 'center', mt: 1, mb: 1 }}>
              We encountered a processing error. 😣 To minimize the risk of corrupting data, we
              won&apos;t proceed.
            </Typography>

            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mt: 1 }}
            >
              <Button
                onClick={() => handleCopyInfo(error)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'none',
                  },
                  fontSize: '18px',
                  minWidth: 'auto',
                  ml: '-0.35em',
                  padding: '2px 6px',
                  textDecoration: 'none',
                  textTransform: 'none',
                }}
                variant='text'
              >
                Copy Info
              </Button>
              <Typography variant='body2' sx={{ textAlign: 'center' }}>
                (to send to app developers)
              </Typography>
            </Box>
            <Typography
              variant='body2'
              component='pre'
              sx={{
                color: theme.palette.primary.cancel,
                fontFamily: 'monospace',
                fontSize: '12px',
                margin: '0 0 10px 0',
                maxHeight: '200px',
                overflow: 'auto',
                textAlign: 'left',
                whiteSpace: 'pre-wrap',
              }}
            >
              {stack}
            </Typography>
          </Stack>
        )}
        <Box sx={{ mt: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'left' }}>
            <Stack direction='row' spacing={1}>
              <Typography sx={{ fontWeight: 'bold' }} variant='body2'>
                Logout:
              </Typography>
              <Typography variant='body2'>
                Remove user settings and return to the login screen
              </Typography>
            </Stack>

            <Stack direction='row' spacing={1}>
              <Typography sx={{ fontWeight: 'bold' }} variant='body2'>
                Reset:
              </Typography>
              <Typography variant='body2'>
                Keep user settings and attempt to reload the app
              </Typography>
            </Stack>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }} />
        <Typography variant='body2' sx={{ textAlign: 'center' }}>
          Either way, any unsaved changes are lost. 🫣
        </Typography>
        <Stack direction='row' spacing={15} sx={{ mt: 2 }}>
          <Button onClick={handleForcedLogout} sx={{ fontSize: '24px' }}>
            Logout
          </Button>
          <Button onClick={handleReset} sx={{ fontSize: '24px' }}>
            Reset
          </Button>
        </Stack>
      </Box>
    )
  }

  return (
    <ErrorBoundary fallbackRender={renderWhoops} onReset={handleReset}>
      {children}
    </ErrorBoundary>
  )
}

export default Whoops
