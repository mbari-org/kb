import { Box, Typography } from '@mui/material'

import MediaItemEdit from './MediaItemEdit'
import MediaReset from './MediaReset'

import { fieldSx } from '@/components/common/format'
import { mediaItemEdits } from '@/lib/kb/conceptState/media'

const MediaDetail = ({ edit }) => {
  const [_, media] = edit

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
        {mediaItemEdits(media).map(mediaItemEdit => {
          const { action, index } = mediaItemEdit
          return (
            <MediaItemEdit
              key={`${action}-${index}`}
              initial={media.initial?.[index]}
              mediaItemEdit={mediaItemEdit}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default MediaDetail
