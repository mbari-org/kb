import { Box } from '@mui/material'

import ReferencesHeader from './ReferencesHeader'
import ReferencesTable from './ReferencesTable'

const References = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ReferencesHeader />
      <ReferencesTable />
    </Box>
  )
}

export default References
