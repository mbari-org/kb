import { useState } from "react"

import { Box } from "@mui/material"

import mbariLogo from "@/assets/login-logo.png"

import ConfigForm from "@/components/config/ConfigForm"
import LoginForm from "@/components/login/LoginForm"

const StartUp = () => {
  const [configIsValid, setConfigIsValid] = useState(false)

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
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
        <ConfigForm
          configIsValid={configIsValid}
          setConfigIsValid={setConfigIsValid}
        />
        <LoginForm configIsValid={configIsValid} />
      </Box>
    </Box>
  )
}

export default StartUp