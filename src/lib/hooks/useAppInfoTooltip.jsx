import { Box, Typography } from '@mui/material'
import { useMemo, use } from 'react'

import UserContext from '@/contexts/user/UserContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import { getVersion } from '@/version'

/**
 * Hook that returns a tooltip component with app information
 * @returns {JSX.Element} A Box component containing app info for use in tooltips
 */
const useAppInfoTooltip = () => {
  const { user } = use(UserContext)
  const { config } = use(ConfigContext)

  return useMemo(() => {
    const loggedInUser = user.name === 'readonly' ? '' : user.name
    const version = getVersion()

    return (
      <Box
        sx={{
          minWidth: 300,
          p: 1.5,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>User:</strong>
          </Typography>
          <Typography variant='body2'>{loggedInUser || 'readonly'}</Typography>
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
      </Box>
    )
  }, [user, config])
}

export default useAppInfoTooltip
