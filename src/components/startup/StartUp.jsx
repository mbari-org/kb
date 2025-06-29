import { use, useCallback, useEffect, useState, useTransition } from 'react'

import { Box } from '@mui/material'

import StartUpContent from '@/components/startup/StartUpContent'

import ConfigContext from '@/contexts/config/ConfigContext'

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
