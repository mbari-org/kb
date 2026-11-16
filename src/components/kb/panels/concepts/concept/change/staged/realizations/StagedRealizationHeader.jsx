import { Box, Typography } from '@mui/material'

import { actionVerb } from '@/components/kb/panels/concepts/concept/change/action'

import itemTitle from '@/lib/concept/itemTitle'

const StagedRealizationHeader = ({ initialRealization, stagedRealization }) => {
  const { action, updates } = stagedRealization
  const linkName = initialRealization?.linkName || updates?.linkName

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography>
        {itemTitle('REALIZATION', actionVerb(action))}:
      </Typography>
      <Typography sx={{ fontWeight: 'bold' }}>{linkName}</Typography>
    </Box>
  )
}

export default StagedRealizationHeader
