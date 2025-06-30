import { use, useActionState, useEffect, useRef } from 'react'

import { Box, Card, CardActions, CardContent, TextField } from '@mui/material'

import SubmitButton from '@/components/common/SubmitButton'
import SubmitError from '@/components/common/SubmitError'

import UserContext from '@/contexts/user/UserContext'
import ConfigContext from '@/contexts/config/ConfigContext'

import { loginUser } from '@/lib/services/auth/login'

const LoginForm = () => {
  const { processAuth } = use(UserContext)
  const { config } = use(ConfigContext)

  const usernameRef = useRef(null)

  const submitLogin = async (_prevState, formData) => {
    const username = formData.get('username')
    const password = formData.get('password')

    return loginUser(config, username, password)
  }
  const [loginState, loginAction] = useActionState(submitLogin, null)

  useEffect(() => {
    !!loginState && processAuth(loginState?.auth)
  }, [loginState, processAuth])

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus()
    }
  }, [])

  return (
    <Box component='form' action={loginAction} sx={{ minHeight: '300px' }}>
      <Card sx={{ bgcolor: 'transparent' }}>
        <CardContent>
          <TextField
            id='login-user'
            inputRef={usernameRef}
            label='Username'
            name='username'
            required
            fullWidth
          />
          <TextField
            id='login-password'
            label='Password'
            name='password'
            required
            type='password'
            fullWidth
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
