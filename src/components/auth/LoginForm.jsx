import { use, useActionState, useEffect, useRef } from 'react'

import { Box, Card, CardActions, CardContent, FormControl, TextField } from '@mui/material'

import SubmitButton from '@/components/common/SubmitButton'
import SubmitError from '@/components/common/SubmitError'

import AuthContext from '@/contexts/auth/AuthContext'
import ConfigContext from '@/contexts/config/ConfigContext'

import { loginUser } from '@/lib/services/oni/auth/login'

const LoginForm = () => {
  const { processAuth } = use(AuthContext)
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
      <Card>
        <CardContent>
          <FormControl fullWidth>
            <TextField
              id='login-user'
              className='field'
              inputRef={usernameRef}
              label='Username'
              name='username'
              required
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <TextField
              id='login-password'
              className='field'
              label='Password'
              name='password'
              required
              type='password'
            />
          </FormControl>
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
