import { Box, Typography } from '@mui/material'
import { use } from 'react'

import AppInfoDetail from '@/components/kb/nav/appInfo/AppInfoDetail'
import DsgBaseURLDetail from '@/components/kb/nav/appInfo/dsgBaseURL/DsgBaseURLDetail'
import MediaBaseURLDetail from '@/components/kb/nav/appInfo/mediaBaseURL/MediaBaseURLDetail'
import PhylogenyRootDetail from '@/components/kb/nav/appInfo/phylogenyRoot/PhylogenyRootDetail'
import UserContext from '@/contexts/user/UserContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import CONFIG from '@/lib/config'
import { getVersion } from '@/version'

const { CONFIG: CONFIG_LABEL, ROLE, USER } = CONFIG.UI.APP_INFO.LABEL
const { VERSION } = CONFIG.UI

const AppInfoContent = ({ conceptNames = [], getConceptPrimaryName, onEditComplete }) => {
  const { user } = use(UserContext)
  const { config } = use(ConfigContext)

  const version = getVersion()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 1 }}>
        <AppInfoDetail label={USER} value={user.name} />
        <AppInfoDetail label={ROLE} value={user.role} />
        <AppInfoDetail label={CONFIG_LABEL} value={config?.url || ''} />
        <PhylogenyRootDetail
          conceptNames={conceptNames}
          getConceptPrimaryName={getConceptPrimaryName}
          onEditComplete={onEditComplete}
        />
        <MediaBaseURLDetail onEditComplete={onEditComplete} />
        <DsgBaseURLDetail onEditComplete={onEditComplete} />
      </Box>
      <Box sx={{ alignSelf: 'flex-end', mt: 2, pb: 2, textAlign: 'right' }}>
        <Typography component='span'>{VERSION.TITLE}{' '}</Typography>
        <Typography component='span' sx={{ fontWeight: 'bold' }}>
          {version}
        </Typography>
      </Box>
    </Box>
  )
}

export default AppInfoContent
