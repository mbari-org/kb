import { ErrorBoundary } from 'react-error-boundary'

import { Box, Button, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { clearStores } from '@/lib/local/store/clearStores'

import CONFIG from '@/text'

import whoopsImage from '@/assets/whoops.jpg'

const BAIL_TO_LOCATION = '/kbeditor/'

const Whoops = ({ children }) => {
  const theme = useTheme()

  // Using window.location.href bypasses the React error boundary
  const handleForcedLogout = () => {
    clearStores()
    window.location.href = BAIL_TO_LOCATION
  }

  const handleReset = () =>
    window.location.href = BAIL_TO_LOCATION

  const handleCopyInfo = async error => {
    const stack = error.original?.stack || error.stack
    const responseMessage = error.title
      ? `${error.title}: ${error.message}\n${error.details ? JSON.stringify(error.details, null, 2) : ''}`
      : CONFIG.WHOOPS.MESSAGE.UNEXPECTED

    const infoToCopy = `${responseMessage}\n\nStack Trace:\n${
      stack || CONFIG.WHOOPS.MESSAGE.NO_STACK
    }`

    await navigator.clipboard.writeText(infoToCopy)
    alert(CONFIG.WHOOPS.ALERT)
  }

  const renderWhoops = ({ error }) => {
    const responseMessage = error.title
      ? `
      ${error.title}: ${error.message}
      ${error.details ? `\n${JSON.stringify(error.details, null, 2)}` : ''}
      `
      : CONFIG.WHOOPS.MESSAGE.UNEXPECTED

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
              {CONFIG.WHOOPS.MESSAGE.IMAGE_SUBTITLE}
            </Typography>
            <Typography variant='body2' sx={{ textAlign: 'center', fontWeight: 'bold', mt: 2 }}>
              💥 {responseMessage} 💥
            </Typography>
            <Typography variant='body2' sx={{ textAlign: 'center', mt: 1, mb: 1 }}>
              {CONFIG.WHOOPS.MESSAGE.ERROR}
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
                {CONFIG.WHOOPS.BUTTON.COPY}
              </Button>
              <Typography variant='body2' sx={{ textAlign: 'center' }}>
                {CONFIG.WHOOPS.MESSAGE.COPY}
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
                {CONFIG.WHOOPS.BUTTON.LOGOUT}:
              </Typography>
              <Typography variant='body2'>
                {CONFIG.WHOOPS.MESSAGE.LOGOUT}
              </Typography>
            </Stack>

            <Stack direction='row' spacing={1}>
              <Typography sx={{ fontWeight: 'bold' }} variant='body2'>
                {CONFIG.WHOOPS.BUTTON.RESET}:
              </Typography>
              <Typography variant='body2'>
                {CONFIG.WHOOPS.MESSAGE.RESET}
              </Typography>
            </Stack>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }} />
        <Typography variant='body2' sx={{ textAlign: 'center' }}>
          {CONFIG.WHOOPS.MESSAGE.UNSAVED}
        </Typography>
        <Stack direction='row' spacing={15} sx={{ mt: 2 }}>
          <Button onClick={handleForcedLogout} sx={{ fontSize: '24px' }}>
            {CONFIG.WHOOPS.BUTTON.LOGOUT}
          </Button>
          <Button onClick={handleReset} sx={{ fontSize: '24px' }}>
            {CONFIG.WHOOPS.BUTTON.RESET}
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
