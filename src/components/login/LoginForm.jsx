import { use, useActionState, useEffect } from "react"

import { Box, Card, CardActions, CardContent, TextField } from "@mui/material"

import SubmitButton from "@/components/common/SubmitButton"
import SubmitError from "@/components/common/SubmitError"

import { login } from "@/lib/auth/login"

import AuthContext from "@/components/auth/AuthContext"

const LoginForm = ({ configIsValid }) => {
  const { updateUser } = use(AuthContext)

  const [loginState, loginAction] = useActionState(login, null)

  useEffect(() => {
    loginState?.user && updateUser(loginState.user)
  }, [loginState, updateUser])

  return (
    <Box component="form" action={loginAction} sx={{ minHeight: "300px" }}>
      {configIsValid && (
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
      )}
    </Box>
  )
}

export default LoginForm
