import { Box, Typography } from '@mui/material'

import { actionVerb } from '@/components/kb/panels/concepts/concept/change/action'

import itemTitle from '@/lib/concept/itemTitle'

const StagedTemplateHeader = ({ initialTemplate, stagedTemplate }) => {
  const { action, updates } = stagedTemplate
  const linkName = initialTemplate?.linkName || updates?.linkName

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography>{itemTitle('TEMPLATE', actionVerb(action))}:</Typography>
      <Typography sx={{ fontWeight: 'bold' }}>{linkName}</Typography>
    </Box>
  )
}

export default StagedTemplateHeader
