import { use, useActionState, useState, useEffect } from 'react'

import { Box, Card, CardActions, CardContent, TextField } from '@mui/material'

import ConfigContext from '@/contexts/config/ConfigContext'
import isValidUrl from '@/lib/validators/isValidUrl'

import SubmitButton from '@/components/common/SubmitButton'
import SubmitError from '@/components/common/SubmitError'

const ConfigForm = ({ configIsDirty, setConfigIsDirty }) => {
  const { config, updateConfig } = use(ConfigContext)
  const [configUrl, setConfigUrl] = useState(() => config?.url || '')
  const [submitError, setSubmitError] = useState('')

  const submitConfigUrl = async (_prevState, formData) => {
    const formConfigUrl = formData.get('configUrl')
    const result = await updateConfig(formConfigUrl)
    setSubmitError(result?.error || '')
    return result
  }

  const [_configState, configAction] = useActionState(submitConfigUrl, '')

  const handleConfigChange = event => {
    const newValue = event.target.value
    setConfigUrl(newValue)
    setSubmitError('')
    setConfigIsDirty(newValue !== config?.url)
  }
  const isConfigUrlChanged = configUrl !== (config?.url || '')
  const isFormDirty = configIsDirty || isConfigUrlChanged
  const displayConfigUrl = isFormDirty ? configUrl : config?.url || configUrl || ''
  const isValidConfigUrl = isValidUrl(displayConfigUrl)
  const isButtonEnabled = isFormDirty && isValidConfigUrl

  useEffect(() => {
    if (config?.url) {
      setConfigIsDirty(false)
    }
  }, [config?.url, setConfigIsDirty])

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
            value={displayConfigUrl}
          />
          <SubmitError errorText={submitError || (!isFormDirty ? config?.error : '') || ''} />
        </CardContent>
        <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
          <SubmitButton buttonText='Set' disabled={!isButtonEnabled} pendingText='Setting...' />
        </CardActions>
      </Card>
    </Box>
  )
}

export default ConfigForm
