import { useActionState } from "react"

import { Box, Card, CardActions, CardContent, TextField } from "@mui/material"

import { css } from "@emotion/react"
import styled from "@emotion/styled"

import mbariLogo from "@/assets/login-logo.png"
import { useAuth } from "@/components/auth/AuthProvider"
import login from "@/lib/auth/login"

import LoginButton from "./LoginButton"
import LoginError from "./LoginError"
import loginStyles from "./loginStyles"

const StyledForm = styled.form`
  ${loginStyles}
`

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
        <StyledForm action={loginAction}>
          <Card css={css({ maxWidth: "400px", mx: "auto" })}>
            <CardContent>
              <TextField
                sx={{ mb: 3 }}
                className="field"
                fullWidth={true}
                label="Username"
                id="login-user"
                name="username"
              />
              <TextField
                className="field"
                fullWidth={true}
                id="login-password"
                label="Password"
                name="password"
                type="password"
              />
              {loginState?.error && <LoginError errorText={loginState.error} />}
            </CardContent>
            <CardActions>
              <LoginButton />
            </CardActions>
          </Card>
        </StyledForm>
      </Box>
    </Box>
  )
}

export default LoginForm
