import { Box, Typography } from '@mui/material'

import MediaItemEdit from './MediaItemEdit'
import MediaReset from './MediaReset'

import { fieldSx } from '@/components/common/format'
import { mediaItemEdits } from '@/lib/kb/concept/media'

const MediaDetails = ({ edit }) => {
  const [_, { initial, pending }] = edit

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <MediaReset />
        <Typography sx={fieldSx}>Media</Typography>
      </Box>
      <Box sx={{ ml: 3 }}>
        {mediaItemEdits(initial, pending).map(mediaItemEdit => {
          if (mediaItemEdit === null) {
            return null
          }
          const [_mediaItemIndex, itemAction, _initialFields, _pendingFields] = mediaItemEdit
          return <MediaItemEdit key={itemAction} mediaItemEdit={mediaItemEdit} />
        })}
      </Box>
    </Box>
  )
}

export default MediaDetails
