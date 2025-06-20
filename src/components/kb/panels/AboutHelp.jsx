import { Box } from '@mui/material'

import EmptyPanel from '@/components/common/panel/EmptyPanel'
import VersionDisplay from '@/components/common/VersionDisplay'

const AboutHelp = () => {
  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 1,
        }}
      >
        <VersionDisplay color='common.black' />
      </Box>
      <EmptyPanel title='About / Help' />
    </Box>
  )
}

export default AboutHelp
