import { Box, Typography } from '@mui/material'

import { actionVerb } from '@/components/kb/panels/concepts/concept/change/action'

const StagedAliasHeader = ({ initialAlias, stagedAlias }) => {
  const { action, updates } = stagedAlias
  const actionText = actionVerb(action)
  const aliasName = initialAlias?.name || updates?.name

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography>{actionText}:</Typography>
      <Typography sx={{ fontWeight: 'bold' }}>{aliasName}</Typography>
    </Box>
  )
}

export default StagedAliasHeader
