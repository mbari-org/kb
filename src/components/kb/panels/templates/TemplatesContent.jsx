import { Box } from '@mui/material'

import TemplatesTableHeader from '@/components/kb/panels/templates/TemplatesTableHeader'
import TemplatesTableData from '@/components/kb/panels/templates/TemplatesTableData'

const TemplatesContent = () => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TemplatesTableHeader />
      <TemplatesTableData />
    </Box>
  )
}

export default TemplatesContent
