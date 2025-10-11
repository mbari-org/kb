import { use, useCallback, useState, useTransition } from 'react'

import { Box } from '@mui/material'

import StartUpContent from '@/components/startup/StartUpContent'

import ConfigContext from '@/contexts/config/ConfigContext'

const StartUp = () => {
  const { config } = use(ConfigContext)

  // null means use default (!config?.valid), otherwise use override
  const [configIsDirtyOverride, setConfigIsDirtyOverride] = useState(null)
  const configIsDirty = configIsDirtyOverride !== null ? configIsDirtyOverride : !config?.valid

  const [_isPending, startTransition] = useTransition()

  const handleConfigChange = useCallback(
    newConfigIsDirty => {
      startTransition(() => {
        setConfigIsDirtyOverride(newConfigIsDirty)
      })
    },
    [startTransition]
  )

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'center',
      }}
    >
      <StartUpContent configIsDirty={configIsDirty} handleConfigChange={handleConfigChange} />
    </Box>
  )
}

export default StartUp
