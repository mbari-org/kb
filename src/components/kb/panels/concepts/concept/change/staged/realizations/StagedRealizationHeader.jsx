import { Box, Typography } from '@mui/material'

import { actionVerb } from '@/components/kb/panels/concepts/concept/change/action'

const StagedRealizationHeader = ({ stagedRealization }) => {
  const { action } = stagedRealization
  const actionText = actionVerb(action)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography>{actionText}</Typography>
    </Box>
  )
}

export default StagedRealizationHeader
