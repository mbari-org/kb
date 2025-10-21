import { use, useActionState, useEffect, useRef, useCallback } from 'react'

import { Box, Card, CardActions, CardContent } from '@mui/material'

import SubmitButton from '@/components/common/SubmitButton'
import SubmitError from '@/components/common/SubmitError'
import LoginInput from '@/components/startup/LoginInput'

import UserContext from '@/contexts/user/UserContext'
import ConfigContext from '@/contexts/config/ConfigContext'

import { loginUser } from '@/lib/services/auth/login'

const LoginForm = ({ isVisible = true }) => {
  const usernameRef = useRef(null)

  const { config } = use(ConfigContext)
  const { processAuth } = use(UserContext)

  const submitLogin = useCallback(async (_prevState, formData) => {
    const username = formData.get('username')
    const password = formData.get('password')

    return loginUser(config, username, password)
  }, [config])

  const [loginState, loginAction] = useActionState(submitLogin, null)

  useEffect(() => {
    !!loginState && processAuth(loginState?.auth)
  }, [loginState, processAuth])

  useEffect(() => {
    if (isVisible && usernameRef.current) {
      usernameRef.current.focus()
    }
  }, [isVisible])

  if (!isVisible) {
    return null
  }

  return (
    <Box component='form' action={loginAction}>
      <Card sx={{ bgcolor: 'transparent' }}>
        <CardContent>
          <LoginInput id='login-user' ref={usernameRef} label='Username' name='username' />
          <LoginInput
            id='login-password'
            label='Password'
            name='password'
            type='password'
            sx={{ mt: 2 }}
          />
          <SubmitError errorText={loginState?.error} />
        </CardContent>
        <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
          <SubmitButton buttonText='Login' pendingText='Logging In...' />
        </CardActions>
      </Card>
    </Box>
  )
}

export default LoginForm
