import { Box, Typography } from '@mui/material'

import { actionVerb } from '@/components/kb/panels/concepts/concept/change/action'

import CONFIG from '@/lib/config'

const { ITEM } = CONFIG.PANELS.CONCEPTS.MODALS

const StagedRealizationHeader = ({ initialRealization, stagedRealization }) => {
  const { action, updates } = stagedRealization
  const actionText = actionVerb(action)
  const linkName = initialRealization?.linkName || updates?.linkName

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography>
        {ITEM.REALIZATION} {actionText}:
      </Typography>
      <Typography sx={{ fontWeight: 'bold' }}>{linkName}</Typography>
    </Box>
  )
}

export default StagedRealizationHeader
