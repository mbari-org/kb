import { useActionState } from "react"

import { Box, Card, CardActions, CardContent, TextField } from "@mui/material"

import { css } from "@emotion/react"

import mbariLogo from "@/assets/login-logo.png"
import { useAuth } from "@/components/auth/AuthProvider"
import login from "@/lib/auth/login"

import LoginButton from "./LoginButton"
import LoginError from "./LoginError"

const LoginForm = () => {
  const { setUser } = useAuth()

  const [loginState, loginAction] = useActionState(login, null)

  if (loginState?.user) {
    setUser(loginState.user)
  }

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
      }}
    >
      <Box
        component="form"
        action={loginAction}
        sx={{
          width: "100%",
          maxWidth: "500px",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
        }}
      >
        <img
          alt=""
          src={mbariLogo}
          style={{
            margin: "0px auto 0",
            display: "block",
            width: "300px",
          }}
        />
        <Card css={css({ maxWidth: "400px", mx: "auto" })}>
          <CardContent>
            <TextField
              id="login-user"
              className="field"
              fullWidth={true}
              label="Username"
              name="username"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              id="login-password"
              className="field"
              fullWidth={true}
              label="Password"
              name="password"
              required
              type="password"
            />
            <LoginError errorText={loginState?.error} />
          </CardContent>
          <CardActions style={{ display: "flex", justifyContent: "center" }}>
            <LoginButton />
          </CardActions>
        </Card>
        {/* </form> */}
      </Box>
    </Box>
  )
}

export default LoginForm
