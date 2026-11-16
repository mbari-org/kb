import { Box, Typography } from '@mui/material'

import { actionVerb } from '@/components/kb/panels/concepts/concept/change/action'

import itemTitle from '@/lib/concept/itemTitle'

const StagedChildHeader = ({ initialChild, stagedChild }) => {
  const { action, updates } = stagedChild
  const childName = initialChild?.name || updates?.name

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography>
        {itemTitle('CHILD', actionVerb(action))}:
      </Typography>
      <Typography sx={{ fontWeight: 'bold' }}>{childName}</Typography>
    </Box>
  )
}

export default StagedChildHeader
