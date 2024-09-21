import { useActionState, useEffect, useState } from "react"

import { Box, Card, CardActions, CardContent, TextField } from "@mui/material"

import { css } from "@emotion/react"

import mbariLogo from "@/assets/login-logo.png"
import login from "@/lib/auth/login"

import { useAuth } from "@/components/auth/AuthProvider"
import configUrlStore from "@/lib/store/configUrl"

import SubmitButton from "./SubmitButton"
import SubmitError from "./SubmitError"

const LoginForm = () => {
  const { updateUser } = useAuth()

  const [configUrl, setConfigUrl] = useState("")
  const [loginState, loginAction] = useActionState(login, null)

  useEffect(() => {
    const storedUrl = configUrlStore.get()
    setConfigUrl(storedUrl)
  }, [])

  useEffect(() => {
    loginState?.user && updateUser(loginState.user)
  }, [loginState, updateUser])

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
            <SubmitError errorText={loginState?.authError} />
            <TextField
              id="config-service-url"
              className="field"
              fullWidth={true}
              label="Config Service URL"
              name="configUrl"
              onChange={e => setConfigUrl(e.target.value)}
              required
              sx={{ mt: 6 }}
              value={configUrl}
            />
            <SubmitError errorText={loginState?.configError} />
          </CardContent>
          <CardActions style={{ display: "flex", justifyContent: "center" }}>
            <SubmitButton />
          </CardActions>
        </Card>
        {/* </form> */}
      </Box>
    </Box>
  )
}

export default LoginForm
