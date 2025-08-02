import { Box, Typography } from '@mui/material'

import { actionVerb } from '@/components/kb/panels/concepts/concept/change/action'

const urlFile = url => url?.split('/').pop()

const StagedMediaItemHeader = ({ initialMediaItem, stagedMediaItem }) => {
  const { action, updates } = stagedMediaItem
  const actionText = actionVerb(action)
  const actionFile = urlFile(initialMediaItem?.url) || urlFile(updates?.url) || ''

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography>{actionText}:</Typography>
      <Typography sx={{ fontWeight: 'bold' }}>{actionFile}</Typography>
    </Box>
  )
}

export default StagedMediaItemHeader
