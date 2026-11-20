import { use, useActionState, useRef, useCallback, useEffect } from 'react'

import { Box, Card, CardActions, CardContent } from '@mui/material'

import SubmitButton from '@/components/common/SubmitButton'
import SubmitError from '@/components/common/SubmitError'
import LoginInput from '@/components/startup/login/LoginInput'

import UserContext from '@/contexts/user/UserContext'
import ConfigContext from '@/contexts/config/ConfigContext'

import { loginUser } from '@/lib/services/auth/login'

import CONFIG from '@/lib/config'

const { BUTTON, BUTTON_PENDING, LABEL } = CONFIG.STARTUP.LOGIN

const LoginForm = ({ isVisible = true }) => {
  const usernameRef = useRef(null)

  const { config } = use(ConfigContext)
  const { processAuth } = use(UserContext)

  const submitLogin = useCallback(
    async (_prevState, formData) => {
      const username = formData.get('username')
      const password = formData.get('password')
      const result = await loginUser(config, username, password)
      if (result.error) return result
      return processAuth(result.auth, { password, username })
    },
    [config, processAuth]
  )

  const [loginState, loginAction] = useActionState(submitLogin, null)

  useEffect(() => {
    if (isVisible && usernameRef.current) {
      usernameRef.current.focus()
    }
  }, [isVisible])

  return (
    <Box component='form' action={loginAction}>
      <Card sx={{ bgcolor: 'transparent' }}>
        <CardContent>
          <LoginInput
            id='login-user'
            autoComplete='username'
            ref={usernameRef}
            label={LABEL.USERNAME}
            name='username'
          />
          <LoginInput
            id='login-password'
            autoComplete='current-password'
            label={LABEL.PASSWORD}
            name='password'
            type='password'
            sx={{ mt: 2 }}
          />
          <SubmitError errorText={loginState?.error?.message} />
        </CardContent>
        <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
          <SubmitButton buttonText={BUTTON} pendingText={BUTTON_PENDING} />
        </CardActions>
      </Card>
    </Box>
  )
}

export default LoginForm
