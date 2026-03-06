import { Box, Typography } from '@mui/material'
import { use } from 'react'

import AppInfoDetail from '@/components/kb/nav/appInfo/AppInfoDetail'
import PhylogenyRootDetail from '@/components/kb/nav/appInfo/phylogenyRoot/PhylogenyRootDetail'
import UserContext from '@/contexts/user/UserContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import { getVersion } from '@/version'

const AppInfoContent = ({ conceptNames = [], getConceptPrimaryName }) => {
  const { user } = use(UserContext)
  const { config } = use(ConfigContext)

  const version = getVersion()

  return (
    <Box sx={{ minWidth: 500, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 1 }}>
        <AppInfoDetail label='User' value={user.name} />
        <AppInfoDetail label='Role' value={user.role} />
        <AppInfoDetail label='Config' value={config?.url || ''} />
        <PhylogenyRootDetail conceptNames={conceptNames} getConceptPrimaryName={getConceptPrimaryName} />
      </Box>
      <Box sx={{ alignSelf: 'flex-end', mt: 2, pb: 2, textAlign: 'right' }}>
        <Typography component='span'>Version: </Typography>
        <Typography component='span' sx={{ fontWeight: 'bold' }}>
          {version}
        </Typography>
      </Box>
    </Box>
  )
}

export default AppInfoContent
