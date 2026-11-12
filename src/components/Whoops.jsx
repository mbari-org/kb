import { useState, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { clearStores } from '@/lib/local/store/clearStores'

import CONFIG from '@/lib/config'

import { getCommitHash, getVersion } from '@/version'

import whoopsImage from '@/assets/whoops.jpg'

const BAIL_TO_LOCATION = '/kbeditor/'
const ALERT_DISMISS_MS = 5000

const Whoops = ({ children }) => {
  const [showAlert, setShowAlert] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    if (!showAlert) return
    const timer = setTimeout(() => setShowAlert(false), ALERT_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [showAlert])

  // Using window.location.href bypasses the React error boundary
  const handleForcedLogout = () => {
    clearStores()
    window.location.href = BAIL_TO_LOCATION
  }

  const handleReset = () => (window.location.href = BAIL_TO_LOCATION)

  const handleCopyInfo = async error => {
    const stack = error.original?.stack || error.stack
    const responseMessage = error.title
      ? `${error.title}: ${error.message}${error.details ? `\nReq: ${JSON.stringify(error.details)}` : ''}`
      : CONFIG.WHOOPS.MESSAGE.UNEXPECTED

    const versionStamp = `Version: v${getVersion()} (${getCommitHash()})`
    const infoToCopy = `${versionStamp}\n\n${responseMessage}\n\nStack Trace:\n${stack || CONFIG.WHOOPS.MESSAGE.NO_STACK}`

    await navigator.clipboard.writeText(infoToCopy)
    setShowAlert(true)
  }

  const renderWhoops = ({ error }) => {
    const responseMessage = error.title
      ? `${error.title}: ${error.message}${error.details ? `\nReq: ${JSON.stringify(error.details)}` : ''}`
      : CONFIG.WHOOPS.MESSAGE.UNEXPECTED

    const stack = error.original?.stack || error.stack

    const copyDevInfo = (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mt: 1 }}>
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
    )

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
        {showAlert && (
          <Alert
            severity='success'
            onClose={() => setShowAlert(false)}
            sx={{ position: 'absolute', top: 16, left: 16, right: 16 }}
          >
            {CONFIG.WHOOPS.ALERT}
          </Alert>
        )}
        <Box
          component='img'
          src={whoopsImage}
          alt='Whoops!'
          sx={{
            maxWidth: '350px',
            width: '50%',
          }}
        />
        <Typography variant='caption' sx={{ mb: 2.5, mt: 0.5, textAlign: 'center' }}>
          Version: v{getVersion()} ({getCommitHash()})
        </Typography>
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
          <>
            <Typography
              sx={{
                fontSize: '18px',
                textAlign: 'center',
                whiteSpace: 'pre-wrap',
              }}
            >
              {responseMessage}
            </Typography>
            {copyDevInfo}
          </>
        )}
        {stack && (
          <Stack sx={{ width: '80%' }}>
            <Typography variant='body1' sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              {CONFIG.WHOOPS.MESSAGE.IMAGE_SUBTITLE}
            </Typography>
            <Typography variant='body2' sx={{ textAlign: 'center', fontWeight: 'bold', mt: 2, whiteSpace: 'pre-wrap' }}>
              💥 {responseMessage} 💥
            </Typography>
            <Typography variant='body2' sx={{ textAlign: 'center', mt: 1, mb: 1 }}>
              {CONFIG.WHOOPS.MESSAGE.ERROR}
            </Typography>

            {copyDevInfo}
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
              <Typography variant='body2'>{CONFIG.WHOOPS.MESSAGE.LOGOUT}</Typography>
            </Stack>

            <Stack direction='row' spacing={1}>
              <Typography sx={{ fontWeight: 'bold' }} variant='body2'>
                {CONFIG.WHOOPS.BUTTON.RESET}:
              </Typography>
              <Typography variant='body2'>{CONFIG.WHOOPS.MESSAGE.RESET}</Typography>
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
