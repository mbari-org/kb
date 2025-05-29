import { use } from 'react'

import { Box, Typography } from '@mui/material'

import MediaItemEdit from './MediaItemEdit'
import MediaReset from './MediaReset'

import { fieldSx } from '@/components/common/format'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { mediaResetting } from '@/components/kb/panels/concepts/change/staged/concept/util'

import { mediaItemEdits } from '@/lib/kb/model/media'
import { RESETTING } from '@/lib/constants'

const MediaDetail = ({ edit }) => {
  const [_, media] = edit

  const { confirmReset } = use(ConceptContext)

  const mediaSx =
    mediaResetting(confirmReset) === RESETTING.OTHER
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
              disabled={mediaResetting(confirmReset, index) === RESETTING.OTHER}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default MediaDetail
