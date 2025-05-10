import { use } from 'react'

import { Box, Typography } from '@mui/material'

import MediaItemEdit from './MediaItemEdit'
import MediaReset from './MediaReset'

import { fieldSx } from '@/components/common/format'
import { mediaItemEdits } from '@/lib/kb/model/media'

import { RESETTING } from '@/lib/constants'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'

const { RESET } = CONCEPT_STATE
const MediaDetail = ({ edit }) => {
  const [_, media] = edit

  const { confirmDiscard } = use(ConceptContext)

  const resettingMediaItem = index => {
    if (!confirmDiscard) return RESETTING.NONE
    if (confirmDiscard.type === RESET.MEDIA) return RESETTING.ME
    if (confirmDiscard.type === RESET.MEDIA_ITEM && confirmDiscard.update?.index === index)
      return RESETTING.ME
    if (confirmDiscard.type === RESET.TO_INITIAL) return RESETTING.ME
    return RESETTING.OTHER
  }

  const mediaSx =
    resettingMediaItem() === RESETTING.OTHER ? { ...fieldSx, color: 'text.disabled' } : fieldSx

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
              resetting={resettingMediaItem(index)}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default MediaDetail
