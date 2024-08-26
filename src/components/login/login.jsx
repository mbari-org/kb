import { Card, CardActions, CardContent, TextField } from "@mui/material"

import { useActionState } from "react"

import LoginButton from "./login-button"

import loginUser from "./login-user"
import useLoginStyles from "./login-styles"
import CenteredBox from "../centered-box/centered-box"
import mbariLogo from "../../assets/login-logo.png"

const Login = () => {
  const [loginState, loginAction] = useActionState(loginUser, null)
  const classes = useLoginStyles()

  const logginError = errorText => (
    <div className={classes.errorContainer}>
      <span className={classes.errorField}>{errorText}</span>
    </div>
  )

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
              label="User"
              id="login-user"
              name="user"
            />
            <TextField
              className={classes.field}
              fullWidth={true}
              id="login-password"
              label="Password"
              name="password"
              type="password"
            />
            {loginState?.error && logginError(loginState.error)}
          </CardContent>
          <CardActions>
            <LoginButton />
          </CardActions>
        </Card>
      </form>
    </CenteredBox>
  )
}

export default Login
