import { Box } from '@mui/material'

import ReferencesHeader from '@/components/kb/panels/references/ReferencesHeader'
import ReferencesTable from '@/components/kb/panels/references/ReferencesTable'

import ReferencesProvider from '@/contexts/references/ReferencesProvider'

const References = () => {
  return (
    <ReferencesProvider>
      <Box>
        <ReferencesHeader />
        <ReferencesTable />
      </Box>
    </ReferencesProvider>
  )
}

export default References
