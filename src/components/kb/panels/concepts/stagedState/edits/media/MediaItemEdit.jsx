import { Box, Typography } from '@mui/material'

import MediaItemReset from './MediaItemReset'
import MediaItemDetail from './MediaItemDetail'

import { fieldSx } from '@/components/common/format'

const urlFile = url => url?.split('/').pop()

const MediaItemEdit = ({ mediaItemEdit, initial }) => {
  const { action, index, updates } = mediaItemEdit

  const actionText = `${action.split(' ').pop()}`
  const actionFile = urlFile(initial?.url) || urlFile(updates?.url) || ''

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
          <Typography sx={fieldSx}>{actionText}:</Typography>
          <Typography sx={{ ...fieldSx, fontWeight: 'bold', ml: 1 }}>{actionFile}</Typography>
        </Box>
      </Box>
      <MediaItemDetail action={action} initial={initial} updates={updates} />
    </Box>
  )
}

export default MediaItemEdit
