import { Box } from '@mui/material'

import Description from '@/components/common/Description'
import StagedDetails from '@/components/kb/panels/concept/change/stagedState/StagedDetail'

const StagedStateContent = () => {
  return (
    <Box minWidth={500}>
      <Description description='You have the following changes:' sx={{ mb: 1 }} />
      <StagedDetails />
    </Box>
  )
}

export default StagedStateContent
