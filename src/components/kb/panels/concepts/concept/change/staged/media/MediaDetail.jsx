import { use } from 'react'

import { Box, Typography } from '@mui/material'

import MediaItemEdit from './MediaItemEdit'
import MediaReset from './MediaReset'

import { fieldSx } from '@/components/common/format'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { resettingMedia } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { mediaItemEdits } from '@/lib/kb/model/media'
import { RESETTING } from '@/lib/constants.js'

const MediaDetail = ({ edit }) => {
  const [_, media] = edit

  const { confirmReset } = use(ConceptContext)

  const mediaSx =
    resettingMedia(confirmReset) === RESETTING.EXTENT.OTHER
      ? { ...fieldSx, color: 'text.disabled' }
      : fieldSx

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
        <Typography sx={mediaSx}>Media</Typography>
      </Box>
      <Box sx={{ ml: 3 }}>
        {mediaItemEdits(media).map(mediaItemEdit => {
          const { action, index } = mediaItemEdit
          return (
            <MediaItemEdit
              key={`${action}-${index}`}
              initial={media.initial?.[index]}
              mediaItemEdit={mediaItemEdit}
              disabled={resettingMedia(confirmReset, index) === RESETTING.EXTENT.OTHER}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default MediaDetail
