import { Box, Typography } from '@mui/material'

import { actionVerb } from '@/components/kb/panels/concepts/concept/change/action'

import itemTitle from '@/lib/concept/itemTitle'

const StagedAliasHeader = ({ initialAlias, stagedAlias }) => {
  const { action, updates } = stagedAlias
  const aliasName = initialAlias?.name || updates?.name

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography>
        {itemTitle('ALIAS', actionVerb(action))}:
      </Typography>
      <Typography sx={{ fontWeight: 'bold' }}>{aliasName}</Typography>
    </Box>
  )
}

export default StagedAliasHeader
