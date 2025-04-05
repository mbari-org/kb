import { use, useCallback, useEffect, useState, useTransition } from 'react'

import { Box, Button } from '@mui/material'

import ConfigForm from '@/components/config/ConfigForm'
import LoginForm from '@/components/auth/LoginForm'

import loginLogo from '@/assets/loginLogo.png'

import AuthContext from '@/contexts/auth/AuthContext'
import ConfigContext from '@/contexts/config/ConfigContext'

import { loginReadOnly } from '@/lib/services/auth/login'

const StartUp = () => {
  const { processAuth } = use(AuthContext)
  const { config } = use(ConfigContext)

  const [configIsDirty, setConfigIsDirty] = useState(true)

  const [_isPending, startTransition] = useTransition()

  const handleConfigChange = useCallback(
    newConfigIsDirty => {
      startTransition(() => {
        setConfigIsDirty(newConfigIsDirty)
      })
    },
    [startTransition]
  )

  const handleLoginReadOnly = useCallback(() => {
    loginReadOnly().then(({ auth }) => {
      processAuth(auth)
    })
  }, [processAuth])

  useEffect(() => {
    setConfigIsDirty(!config?.valid)
  }, [config])

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          borderRadius: '8px',
          boxShadow: '0 0 20px rgba(0,0,0,0.3)',
          maxWidth: '500px',
          padding: '20px',
          width: '100%',
        }}
      >
        <img
          alt=''
          src={loginLogo}
          style={{
            margin: '0px auto 0',
            display: 'block',
            width: '300px',
          }}
        />
        <ConfigForm configIsDirty={configIsDirty} setConfigIsDirty={handleConfigChange} />
        <Box
          sx={{
            opacity: configIsDirty ? 0 : 1,
            pointerEvents: configIsDirty ? 'none' : 'auto',
            transition: 'opacity 300ms ease-out',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mb: -2,
              mr: 2,
              mt: 2,
            }}
          >
            <Button
              onClick={handleLoginReadOnly}
              sx={{
                '&:hover': {
                  fontStyle: 'italic',
                },
                background: 'none',
                border: 'none',
                color: 'blue',
                cursor: 'pointer',
                fontSize: '16px',
                textDecoration: 'none',
              }}
            >
              Read Only
            </Button>
          </Box>
          <LoginForm />
        </Box>
      </Box>
    </Box>
  )
}

export default StartUp
