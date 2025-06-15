import { Box } from '@mui/material'
import PanelTitle from '@/components/common/panel/PanelTitle'
import VersionDisplay from '@/components/common/VersionDisplay'

const AboutHelp = () => {
  return (
    <Box sx={{ position: 'relative' }}>
      <PanelTitle title='About / Help' />
      <Box sx={{ position: 'absolute', top: 0, right: 0, mt: -2 }}>
        <VersionDisplay color='common.black' variant='caption' display='text' />
      </Box>
    </Box>
  )
}

export default AboutHelp
