import { ErrorBoundary } from 'react-error-boundary'

import { Box, Button, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { clearStores } from '@/lib/store/clearStores'

import whoopsImage from '@/assets/whoops.jpg'

const Whoops = ({ children }) => {
  const theme = useTheme()

  const handleForcedLogout = () => {
    clearStores()

    // Use window.location.href to bypass the React error boundary
    window.location.href = '/kbeditor/login'
  }

  const renderWhoops = ({ error }) => {
    console.log('error', error)

    const responseMessage = error.whoops
      ? `
      ${error.whoops?.title}: ${error.whoops?.message}
      ${error.whoops?.method}
      ${error.whoops?.url}
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
          <Stack sx={{ mt: 1, width: '80%' }}>
            <Typography variant='body2' sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              {responseMessage}
            </Typography>
            <Typography variant='body2' sx={{ mt: 4 }}>
              The info below will be useful to the app developers:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
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
        <Typography variant='body2' sx={{ textAlign: 'center', mt: 3 }}>
          Apologies, the app has encountered an error and will not proceed in fear of corrupting
          data.
        </Typography>
        <Box sx={{ mt: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant='body2'>
              Logout: Remove user settings and return to the login screen
            </Typography>
            <Typography variant='body2'>
              Reset: Keep user settings and attempt to reload the app
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }} />
        <Typography variant='body2' sx={{ textAlign: 'center' }}>
          Either way, any unsaved changes have been lost. 🫣
        </Typography>
        <Stack direction='row' spacing={15} sx={{ mt: 4 }}>
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

  const handleReset = () => {
    window.location.reload()
  }

  const handleCopyInfo = async error => {
    const stack = error.original?.stack || error.stack
    const responseMessage = error.whoops
      ? `${error.whoops?.title}: ${error.whoops?.message}\n${error.whoops?.method}\n${error.whoops?.url}`
      : 'An unexpected error occurred'

    const infoToCopy = `Error: ${responseMessage}\n\nStack Trace:\n${
      stack || 'No stack trace available'
    }`

    try {
      await navigator.clipboard.writeText(infoToCopy)
      // Could add a toast notification here if desired
    } catch (err) {
      console.error('Failed to copy error info:', err)
    }
  }

  return (
    <ErrorBoundary fallbackRender={renderWhoops} onReset={handleReset}>
      {children}
    </ErrorBoundary>
  )
}

export default Whoops
