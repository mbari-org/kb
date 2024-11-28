import { use, useActionState, useEffect, useRef } from "react"

import { Box, Card, CardActions, CardContent, TextField } from "@mui/material"

import SubmitButton from "@/components/common/SubmitButton"
import SubmitError from "@/components/common/SubmitError"

import AuthContext from "@/contexts/auth/AuthContext"
import ConfigContext from "@/contexts/config/ConfigContext"

import login from "@/lib/services/oni/auth/login"

const LoginForm = () => {
  const { updateAuth } = use(AuthContext)
  const { config } = use(ConfigContext)
  const usernameRef = useRef(null)

  const submitLogin = async (_prevState, formData) => {
    const username = formData.get("username")
    const password = formData.get("password")

    return login(config, username, password)
  }
  const [loginState, loginAction] = useActionState(submitLogin, null)

  useEffect(() => {
    updateAuth(loginState?.auth)
  }, [loginState, updateAuth])

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus()
    }
  }, [])

  return (
    <Box component="form" action={loginAction} sx={{ minHeight: "300px" }}>
      <Card>
        <CardContent>
          <TextField
            id="login-user"
            className="field"
            fullWidth={true}
            inputRef={usernameRef}
            label="Username"
            name="username"
            required
          />
          <TextField
            id="login-password"
            className="field"
            fullWidth={true}
            label="Password"
            name="password"
            required
            sx={{ mt: 2 }}
            type="password"
          />
          <SubmitError errorText={loginState?.error} />
        </CardContent>
        <CardActions style={{ display: "flex", justifyContent: "center" }}>
          <SubmitButton buttonText="Login" pendingText="Logging In..." />
        </CardActions>
      </Card>
    </Box>
  )
}

export default LoginForm
