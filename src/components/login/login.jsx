import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
} from "@mui/material"

import { useActionState } from "react"

import useLoginStyles from "./login-styles"
import CenteredBox from "../centered-box/centered-box"
import mbariLogo from "../../assets/login-logo.png"

const Login = () => {
  const classes = useLoginStyles()

  const [resp, submitAction, isPending] = useActionState(
    async (prevState, formData) => {
      if (
        formData.get("user") === "admin" &&
        formData.get("password") === "admin"
      ) {
        return null
      }
      return { error: "????" }
    },
    {
      user: "",
      password: "",
    }
  )

  return (
    <>
      <CenteredBox component="main" sx={{ width: "100%", height: "100vh" }}>
        <img
          alt=""
          className={classes.logo}
          src={mbariLogo}
          sx={{ mx: "auto", width: "200px" }}
        />
        <form action={submitAction}>
          <Card sx={{ maxWidth: "400px", mx: "auto" }}>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                className={classes.field}
                fullWidth={true}
                id="login-user"
                label="User"
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
            </CardContent>
            <CardActions>
              <Button
                disabled={isPending}
                type="submit"
                sx={{ mx: "auto" }}
                variant="contained"
              >
                {isPending ? "..." : "Login"}
              </Button>
            </CardActions>
          </Card>
        </form>
      </CenteredBox>
    </>
  )
}

export default Login
