import { Box, Typography } from '@mui/material'

import MediaItemReset from './MediaItemReset'
import MediaItemDetail from './MediaItemDetail'

import { actionVerb } from '@/components/kb/panels/concepts/concept/change/action'
import { fieldSx } from '@/components/common/format'

const urlFile = url => url?.split('/').pop()

const MediaItemEdit = ({ disabled, initial, mediaItemEdit }) => {
  const { action, index, updates } = mediaItemEdit

  const actionText = actionVerb(action)
  const actionFile = urlFile(initial?.url) || urlFile(updates?.url) || ''

  const mediaItemSx = disabled ? { ...fieldSx, color: 'text.disabled' } : fieldSx

  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        mt: 0.5,
      }}
    >
      <Box sx={{ alignItems: 'center', display: 'flex' }}>
        <MediaItemReset index={index} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={mediaItemSx}>{actionText}:</Typography>
          <Typography sx={{ ...mediaItemSx, fontWeight: 'bold', ml: 1 }}>{actionFile}</Typography>
        </Box>
      </Box>
      <MediaItemDetail action={action} disabled={disabled} initial={initial} updates={updates} />
    </Box>
  )
}

export default MediaItemEdit
