import { Box, Typography } from '@mui/material'
import { use } from 'react'

import UserContext from '@/contexts/user/UserContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import { getCommitHash, getVersion } from '@/version'

const AppInfoContent = () => {
  const { user } = use(UserContext)
  const { config } = use(ConfigContext)

  const version = getVersion()
  const commitHash = getCommitHash()

  const containerSx = { minWidth: 360, p: 1, borderRadius: 1 }

  return (
    <Box sx={containerSx}>
      <Box sx={{ display: 'flex', mb: 1 }}>
        <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
          <strong>User:</strong>
        </Typography>
        <Typography variant='body2'>{user.name}</Typography>
      </Box>
      <Box sx={{ display: 'flex', mb: 1 }}>
        <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
          <strong>Role:</strong>
        </Typography>
        <Typography variant='body2'>{user.role}</Typography>
      </Box>
      <Box sx={{ display: 'flex', mb: 1 }}>
        <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
          <strong>Config:</strong>
        </Typography>
        <Typography variant='body2'>{config?.url || ''}</Typography>
      </Box>
      <Box sx={{ display: 'flex', mb: 1 }}>
        <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
          <strong>Version:</strong>
        </Typography>
        <Typography variant='body2'>{version}</Typography>
      </Box>
      <Box sx={{ display: 'flex', mb: 1 }}>
        <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
          <strong>Commit:</strong>
        </Typography>
        <Typography variant='body2'>{commitHash}</Typography>
      </Box>
    </Box>
  )
}

export default AppInfoContent
