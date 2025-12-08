import { Box, useTheme } from '@mui/material'

import EmptyPanel from '@/components/common/panel/EmptyPanel'
import VersionDisplay from '@/components/common/VersionDisplay'
import { CONFIG } from '@/config/js/index.js'

const TITLE = CONFIG.PANELS.ABOUT_HELP.TITLE

const AboutHelp = () => {
  const theme = useTheme()

  return (
    <Box
      sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Box sx={{ width: '100%' }}>
        <EmptyPanel title={TITLE} />
        </Box>
      <Box sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
        <VersionDisplay color={theme.palette.primary.main} />
      </Box>
    </Box>
  )
}

export default AboutHelp
