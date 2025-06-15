import { Box } from '@mui/material'

import ExportReferences from '@/components/kb/panels/export/ExportReferences'
import ExportTemplates from '@/components/kb/panels/export/ExportTemplates'
import ExportUsers from '@/components/kb/panels/export/ExportUsers'
import PanelTitle from '@/components/common/PanelTitle'

const Export = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', ml: 2, gap: 2 }}>
      <PanelTitle title='Export' />
      <ExportReferences />
      <ExportTemplates />
      <ExportUsers />
    </Box>
  )
}

export default Export
