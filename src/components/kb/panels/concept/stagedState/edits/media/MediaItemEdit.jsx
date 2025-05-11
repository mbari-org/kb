import { Box, Typography } from '@mui/material'

import MediaItemReset from './MediaItemReset'
import MediaItemDetail from './MediaItemDetail'

import { fieldSx } from '@/components/common/format'

import { RESETTING } from '@/lib/constants'

const urlFile = url => url?.split('/').pop()

const MediaItemEdit = ({ mediaItemEdit, initial, resetting }) => {
  const { action, index, updates } = mediaItemEdit

  const actionText = `${action.split(' ').pop()}`
  const actionFile = urlFile(initial?.url) || urlFile(updates?.url) || ''

  const mediaItemSx =
    resetting === RESETTING.OTHER ? { ...fieldSx, color: 'text.disabled' } : fieldSx

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
      <MediaItemDetail action={action} initial={initial} resetting={resetting} updates={updates} />
    </Box>
  )
}

export default MediaItemEdit
