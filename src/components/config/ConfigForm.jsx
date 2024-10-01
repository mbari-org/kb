import { use, useActionState, useEffect, useState } from "react"

import { Box, Card, CardActions, CardContent, TextField } from "@mui/material"

import ConfigContext from "@/contexts/config/ConfigContext"

import SubmitButton from "@/components/common/SubmitButton"
import SubmitError from "@/components/common/SubmitError"

const ConfigForm = ({ configIsDirty, setConfigIsDirty }) => {
  const { config, setConfig } = use(ConfigContext)

  const [configUrl, setConfigUrl] = useState(null)

  const submitConfigUrl = async (_prevState, formData) => {
    const formConfigUrl = formData.get("configUrl")
    return setConfig(formConfigUrl)
  }

  const [configState, configAction] = useActionState(submitConfigUrl, "")

  const handleConfigChange = event => {
    const url = event.target.value
    setConfigUrl(url)
    setConfigIsDirty(!!url && url !== config?.url)
  }

  useEffect(() => {
    setConfigUrl(config?.url || "")
  }, [config])

  return (
    <Box component="form" action={configAction}>
      <Card>
        <CardContent>
          <TextField
            id="config-service-url"
            className="field"
            fullWidth={true}
            label="Config Service URL"
            name="configUrl"
            onChange={handleConfigChange}
            required
            sx={{ mt: 1 }}
            value={configUrl || ""}
          />
          <SubmitError errorText={config?.error || configState?.error || ""} />
        </CardContent>
        <CardActions style={{ display: "flex", justifyContent: "center" }}>
          <SubmitButton
            buttonText="Set"
            disabled={!configIsDirty}
            pendingText="Setting..."
          />
        </CardActions>
      </Card>
    </Box>
  )
}

export default ConfigForm
