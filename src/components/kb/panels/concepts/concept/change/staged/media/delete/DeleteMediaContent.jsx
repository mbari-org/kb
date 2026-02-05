import { use } from 'react'
import { Box, Typography } from '@mui/material'

import Detail from '@/components/common/factory/Detail'
import ModalActionText from '@/components/common/ModalActionText'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import CONFIG from '@/text'
import { getItemMediaType } from '@/lib/model/media'
import { pick } from '@/lib/utils'

const { MEDIA } = CONFIG.PANELS.CONCEPTS.MODALS

const DeleteMediaContent = () => {
  const {
    stagedState: { media, mediaIndex },
  } = use(ConceptContext)

  const mediaItem = media?.[mediaIndex]
  const detail = mediaItem ? pick(mediaItem, ['url', 'credit', 'caption', 'isPrimary']) : {}
  const mediaType = getItemMediaType(mediaItem)
  const hasOtherMediaOfType = mediaType
    ? media.some((item, index) => index !== mediaIndex && getItemMediaType(item) === mediaType)
    : false
  const showPrimaryReassignMessage = !!mediaItem?.isPrimary && hasOtherMediaOfType
  const primaryReassignMessage = MEDIA.DELETE.PRIMARY_REASSIGN_MESSAGE ?? []

  return (
    <Box>
      <ModalActionText text={MEDIA.DELETE.LABEL} />
      <Box sx={{ ml: 2, mt: 1 }}>
        <Detail id='delete-media-content-detail' detail={detail} />
      </Box>
      {showPrimaryReassignMessage && (
          <Box sx={{ ml: 2, mt: 1 }}>
            <Typography variant='body2' sx={{ color: 'text.secondary', textAlign: 'center' }}>
            {primaryReassignMessage.map((line, index) => (
              <span key={`${line}-${index}`}>
                {line}
                {index < primaryReassignMessage.length - 1 && <br />}
              </span>
            ))}
            </Typography>
        </Box>
      )}
    </Box>
  )
}

export default DeleteMediaContent
