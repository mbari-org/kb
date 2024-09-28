import { use, useActionState, useEffect } from "react"

import { Box, Card, CardActions, CardContent, TextField } from "@mui/material"

import SubmitButton from "@/components/common/SubmitButton"
import SubmitError from "@/components/common/SubmitError"

import AuthContext from "@/components/auth/AuthContext"
import ConfigContext from "@/components/config/ConfigContext"

import { login } from "@/lib/auth/login"

const LoginForm = () => {
  const { updateUser } = use(AuthContext)
  const { config } = use(ConfigContext)

  const submitLogin = async (_prevState, formData) => {
    const username = formData.get("username")
    const password = formData.get("password")

    return login(config.getServiceUrl, username, password)
  }
  const [loginState, loginAction] = useActionState(submitLogin, null)

  useEffect(() => {
    loginState?.user && updateUser(loginState.user)
  }, [loginState, updateUser])

  return (
    <Box component="form" action={loginAction} sx={{ minHeight: "300px" }}>
      <Card>
        <CardContent>
          <TextField
            id="login-user"
            className="field"
            fullWidth={true}
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
