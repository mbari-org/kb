import { useActionState } from "react"

import { Card, CardActions, CardContent, TextField } from "@mui/material"
import { css } from "@emotion/react"
import styled from "@emotion/styled"

import { useAuth } from "@/components/auth/AuthProvider"
import CenteredBox from "@/components/box/CenteredBox"
import mbariLogo from "@/assets/login-logo.png"
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
    <CenteredBox
      variant="default"
      customClasses={{
        root: css({ width: "100%", height: "100vh" }),
        content: css({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }),
      }}
    >
      <img alt="" css={css({ mx: "auto", width: "200px" })} src={mbariLogo} />
      <StyledForm action={loginAction}>
        <Card css={css({ maxWidth: "400px", mx: "auto" })}>
          <CardContent
            css={css({
              alignItems: "stretch",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              height: "150px",
            })}
          >
            <TextField
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
    </CenteredBox>
  )
}

export default LoginForm
