import { Box } from '@mui/material'

import Description from '@/components/common/Description'
import StagedDetail from '@/components/kb/panels/concept/change/staged/StagedDetail'

const StagedContent = () => {
  return (
    <Box minWidth={500}>
      <Description description='You have the following changes:' sx={{ mb: 1 }} />
      <StagedDetail />
    </Box>
  )
}

export default StagedContent
