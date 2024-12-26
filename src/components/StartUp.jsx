import { use, useCallback, useEffect, useState, useTransition } from "react"

import { Box } from "@mui/material"

import ConfigForm from "@/components/config/ConfigForm"
import LoginForm from "@/components/auth/LoginForm"

import mbariLogo from "@/assets/login-logo.png"

import ConfigContext from "@/contexts/config/ConfigContext"

const StartUp = () => {
  const { config } = use(ConfigContext)
  const [configIsDirty, setConfigIsDirty] = useState(true)

  const [_isPending, startTransition] = useTransition()

  const handleConfigChange = useCallback(
    newConfigIsDirty => {
      startTransition(() => {
        setConfigIsDirty(newConfigIsDirty)
      })
    },
    [startTransition]
  )

  useEffect(() => {
    setConfigIsDirty(!config?.valid)
  }, [config])

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
          configIsDirty={configIsDirty}
          setConfigIsDirty={handleConfigChange}
        />
        <Box
          style={{
            opacity: configIsDirty ? 0 : 1,
            transition: "opacity 300ms ease-out",
            pointerEvents: configIsDirty ? "none" : "auto",
          }}
        >
          <LoginForm />
        </Box>
      </Box>
    </Box>
  )
}

export default StartUp
