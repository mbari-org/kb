import { Box, Typography } from '@mui/material'
import { use } from 'react'

import AppInfoDetail from '@/components/kb/nav/appInfo/AppInfoDetail'
import DsgConceptURLDetail from '@/components/kb/nav/appInfo/dsgConceptURL/DsgConceptURLDetail'
import MediaBaseURLDetail from '@/components/kb/nav/appInfo/mediaBaseURL/MediaBaseURLDetail'
import PhylogenyRootDetail from '@/components/kb/nav/appInfo/phylogenyRoot/PhylogenyRootDetail'
import UserContext from '@/contexts/user/UserContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import { getVersion } from '@/version'

const AppInfoContent = ({ conceptNames = [], getConceptPrimaryName, onEditComplete }) => {
  const { user } = use(UserContext)
  const { config } = use(ConfigContext)

  const version = getVersion()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 1 }}>
        <AppInfoDetail label='User' value={user.name} />
        <AppInfoDetail label='Role' value={user.role} />
        <AppInfoDetail label='Config' value={config?.url || ''} />
        <PhylogenyRootDetail
          conceptNames={conceptNames}
          getConceptPrimaryName={getConceptPrimaryName}
          onEditComplete={onEditComplete}
        />
        <MediaBaseURLDetail onEditComplete={onEditComplete} />
        <DsgConceptURLDetail onEditComplete={onEditComplete} />
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
