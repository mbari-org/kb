import { useActionState, useEffect, useState } from "react"

import { Box, Card, CardActions, CardContent, TextField } from "@mui/material"

import SubmitButton from "@/components/common/SubmitButton"
import SubmitError from "@/components/common/SubmitError"

import { setConfigUrl } from "@/lib/services/config/config"
import configUrlStore from "@/lib/store/configUrl"

const ConfigForm = ({ configIsValid, setConfigIsValid }) => {
  const [config, setConfig] = useState(null)

  const submitConfigUrl = async (_prevState, formData) => {
    const formConfigUrl = formData.get("configUrl")
    const result = await setConfigUrl(formConfigUrl)
    setConfigIsValid(!!result.url && !result.error)
    return result
  }

  const [configState, configAction] = useActionState(submitConfigUrl, "")

  const handleConfigChange = event => {
    const url = event.target.value
    setConfig({ url })
    setConfigIsValid(false)
  }

  useEffect(() => {
    const storedConfigUrl = configUrlStore.get()
    setConfigUrl(storedConfigUrl).then(result => {
      setConfig(result)
      setConfigIsValid(!!result.url && !result.error)
    })
  }, [])

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
            value={config?.url || ""}
          />
          <SubmitError errorText={config?.error || configState?.error || ""} />
        </CardContent>
        <CardActions style={{ display: "flex", justifyContent: "center" }}>
          <SubmitButton
            buttonText="Set"
            disabled={configIsValid}
            pendingText="Setting..."
          />
        </CardActions>
      </Card>
    </Box>
  )
}

export default ConfigForm
