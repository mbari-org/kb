import { use, useActionState, useState } from 'react'

import { Box, Card, CardActions, CardContent, TextField } from '@mui/material'

import ConfigContext from '@/contexts/config/ConfigContext'

import SubmitButton from '@/components/common/SubmitButton'
import SubmitError from '@/components/common/SubmitError'

const ConfigForm = ({ configIsDirty, setConfigIsDirty }) => {
  const { config, updateConfig } = use(ConfigContext)

  const [localConfigUrl, setLocalConfigUrl] = useState(null)
  const configUrl = localConfigUrl !== null ? localConfigUrl : (config?.url || '')

  const submitConfigUrl = async (_prevState, formData) => {
    const formConfigUrl = formData.get('configUrl')
    return updateConfig(formConfigUrl)
  }

  const [configState, configAction] = useActionState(submitConfigUrl, '')

  const handleConfigChange = event => {
    const url = event.target.value
    setLocalConfigUrl(url)
    setConfigIsDirty(url && url !== config?.url)
  }

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
            value={configUrl}
          />
          <SubmitError errorText={config?.error || configState?.error || ''} />
        </CardContent>
        <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
          <SubmitButton buttonText='Set' disabled={!configIsDirty} pendingText='Setting...' />
        </CardActions>
      </Card>
    </Box>
  )
}

export default ConfigForm
