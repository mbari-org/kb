import { Box, Typography } from '@mui/material'

import MediaItemEdit from './MediaItemEdit'
import MediaReset from './MediaReset'

import { fieldSx } from '@/components/common/format'
import { mediaItemEdits } from '@/lib/kb/concept/media'

const MediaDetails = ({ edit }) => {
  const [_, { initial, editing }] = edit

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
        {mediaItemEdits(initial, editing).map(mediaItemEdit => {
          if (mediaItemEdit === null) {
            return null
          }
          const [_mediaItemIndex, editingAction, _initialFields, _editingFields] = mediaItemEdit
          return <MediaItemEdit key={editingAction} mediaItemEdit={mediaItemEdit} />
        })}
      </Box>
    </Box>
  )
}

export default MediaDetails
