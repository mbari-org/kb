import { Box } from '@mui/material'

import ExportUsers from '@/components/kb/panels/export/ExportUsers'
import PanelTitle from '@/components/common/PanelTitle'

const Export = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', ml: 2 }}>
      <PanelTitle title='Export' />
      <ExportUsers />
    </Box>
  )
}

export default Export
