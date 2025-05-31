import { Box } from '@mui/material'

import ReferencesHeader from '@/components/kb/panels/references/ReferencesHeader'
import ReferencesTable from '@/components/kb/panels/references/ReferencesTable'

import useLoadReferences from '@/components/kb/panels/references/useLoadReferences'

const References = () => {
  const { references } = useLoadReferences()

  return (
    <Box>
      <ReferencesHeader />
      <ReferencesTable references={references} />
    </Box>
  )
}

export default References
