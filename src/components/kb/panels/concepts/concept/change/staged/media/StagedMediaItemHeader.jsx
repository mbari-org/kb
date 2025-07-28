import { Box, Typography } from '@mui/material'

const urlFile = url => url?.split('/').pop()

const StagedMediaItemHeader = ({ initialMediaItem, stagedMediaItem }) => {
  const { action, updates } = stagedMediaItem
  const actionText = `${action.split(' ').pop()}`
  const actionFile = urlFile(initialMediaItem?.url) || urlFile(updates?.url) || ''

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography>{actionText}:</Typography>
      <Typography sx={{ fontWeight: 'bold' }}>{actionFile}</Typography>
    </Box>
  )
}

export default StagedMediaItemHeader
