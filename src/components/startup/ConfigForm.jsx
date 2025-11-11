import { use, useActionState, useState, useEffect } from 'react'

import { Box, Card, CardActions, CardContent, TextField } from '@mui/material'

import ConfigContext from '@/contexts/config/ConfigContext'
import isValidUrl from '@/lib/validators/isValidUrl'

import SubmitButton from '@/components/common/SubmitButton'
import SubmitError from '@/components/common/SubmitError'

const ConfigForm = ({ configIsDirty, setConfigIsDirty }) => {
  const { config, updateConfig } = use(ConfigContext)
  const [configUrl, setConfigUrl] = useState(config?.url || '')

  const inputUrl = config?.valid ? config.url : configUrl

  const submitConfigUrl = async (_prevState, formData) => {
    const formConfigUrl = formData.get('configUrl')
    return updateConfig(formConfigUrl)
  }

  const [configState, configAction] = useActionState(submitConfigUrl, '')

  const handleConfigChange = event => {
    const newValue = event.target.value
    setConfigUrl(newValue)
    setConfigIsDirty(newValue && newValue !== config?.url)
  }

  const isUrlValid = isValidUrl(configUrl)
  const isButtonEnabled = configIsDirty && isUrlValid

  useEffect(() => {
    if (config?.valid) {
      setConfigIsDirty(false)
    }
  }, [config?.valid, setConfigIsDirty])

  return (
    <Box component='form' action={configAction}>
      <Card sx={{ bgcolor: 'transparent' }}>
        <CardContent>
          <TextField
            id='config-service-url'
            fullWidth
            label='Config Service URL'
            name='configUrl'
            onChange={handleConfigChange}
            required
            sx={{ mt: 1 }}
            value={inputUrl}
          />
          <SubmitError errorText={config?.error || configState?.error || ''} />
        </CardContent>
        <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
          <SubmitButton buttonText='Set' disabled={!isButtonEnabled} pendingText='Setting...' />
        </CardActions>
      </Card>
    </Box>
  )
}

export default ConfigForm
