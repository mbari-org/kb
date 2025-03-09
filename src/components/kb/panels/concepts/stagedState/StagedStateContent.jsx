import { Box } from '@mui/material'

import Description from '@/components/common/Description'
import StagedDetails from '@/components/kb/panels/concepts/stagedState/edits/StagedDetails'

const StagedStateContent = () => {
  return (
    <Box minWidth={500}>
      <Description description='You have the following unsaved changes:' sx={{ mb: 1 }} />
      <StagedDetails />
    </Box>
  )
}

export default StagedStateContent
