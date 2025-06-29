import { Box, useTheme } from '@mui/material'

import StartUpImage from '@/components/startup/StartUpImage'
import ConfigForm from '@/components/startup/ConfigForm'
import ReadOnlyLogin from '@/components/startup/ReadOnlyLogin'
import LoginForm from '@/components/startup/LoginForm'
import StartUpVersion from '@/components/startup/StartUpVersion'

const StartUpContent = ({ configIsDirty, handleConfigChange }) => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[300],
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(0,0,0,0.3)',
        maxWidth: '500px',
        padding: '20px',
        width: '100%',
      }}
    >
      <StartUpImage />
      <ConfigForm configIsDirty={configIsDirty} setConfigIsDirty={handleConfigChange} />
      <ReadOnlyLogin />
      <Box
        sx={{
          minHeight: '300px',
          opacity: configIsDirty ? 0 : 1,
          transition: 'opacity 300ms ease-out',
        }}
      >
        <LoginForm />
      </Box>
      <StartUpVersion />
    </Box>
  )
}

export default StartUpContent
