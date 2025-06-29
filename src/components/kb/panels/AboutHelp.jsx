import { Box, useTheme } from '@mui/material'

import EmptyPanel from '@/components/common/panel/EmptyPanel'
import VersionDisplay from '@/components/common/VersionDisplay'

const AboutHelp = () => {
  const theme = useTheme()

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 0,
          zIndex: 1,
        }}
      >
        <VersionDisplay color={theme.palette.primary.main} />
      </Box>
      <EmptyPanel title='About / Help' />
    </Box>
  )
}

export default AboutHelp
