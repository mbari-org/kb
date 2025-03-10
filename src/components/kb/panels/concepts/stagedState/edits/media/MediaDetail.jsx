import { Box, Typography } from '@mui/material'

import MediaItemEdit from './MediaItemEdit'
import MediaReset from './MediaReset'

import { fieldSx } from '@/components/common/format'
import { mediaItemEdits } from '@/lib/kb/concept/media'

const MediaDetail = ({ edit }) => {
  const [_, { initial, staged }] = edit

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
        {mediaItemEdits(initial, staged).map(mediaItemEdit => {
          if (mediaItemEdit === null) {
            return null
          }
          const [mediaItemIndex, stagedAction, _initialFields, _stagedFields] = mediaItemEdit
          return (
            <MediaItemEdit
              key={`${mediaItemIndex}-${stagedAction}`}
              mediaItemEdit={mediaItemEdit}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default MediaDetail
