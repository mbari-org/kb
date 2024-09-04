import { Card, CardActions, CardContent, TextField } from "@mui/material"

import { useActionState } from "react"

import CenteredBox from "@/components/box/CenteredBox"

import LoginButton from "./LoginButton"
import LoginError from "./LoginError"
import useLoginStyles from "./loginStyles"

import mbariLogo from "@/assets/login-logo.png"

import { useAuth } from "@/components/auth/AuthProvider"

import login from "@/lib/auth/login"

const LoginForm = () => {
  const classes = useLoginStyles()

  const [loginState, loginAction] = useActionState(login, null)

  const { setUser } = useAuth()

  if (loginState?.user) {
    setUser(loginState.user)
  }

  return (
    <CenteredBox component="main" sx={{ width: "100%", height: "100vh" }}>
      <img
        alt=""
        className={classes.logo}
        src={mbariLogo}
        sx={{ mx: "auto", width: "200px" }}
      />
      <form action={loginAction}>
        <Card sx={{ maxWidth: "400px", mx: "auto" }}>
          <CardContent
            sx={{
              alignItems: "stretch",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              height: "150px",
            }}
          >
            <TextField
              className={classes.field}
              fullWidth={true}
              label="Username"
              id="login-user"
              name="username"
            />
            <TextField
              className={classes.field}
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
      </form>
    </CenteredBox>
  )
}

export default LoginForm
