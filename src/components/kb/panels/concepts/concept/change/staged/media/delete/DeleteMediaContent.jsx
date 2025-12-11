import { use } from 'react'
import { Box } from '@mui/material'

import Detail from '@/components/common/factory/Detail'
import ModalActionText from '@/components/common/ModalActionText'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import CONFIG from '@/text'
import { drop } from '@/lib/utils'

const { MEDIA } = CONFIG.PANELS.CONCEPTS.MODALS

const DeleteMediaContent = () => {
  const {
    stagedState: { media, mediaIndex },
  } = use(ConceptContext)

  const mediaItem = media[mediaIndex]

  const detail = drop(mediaItem, ['action', 'conceptName', 'id', 'mimeType'])

  return (
    <Box>
      <ModalActionText text={MEDIA.DELETE.LABEL} />
      <Box sx={{ ml: 2, mt: 1 }}>
        <Detail id='delete-media-content-detail' detail={detail} />
      </Box>
    </Box>
  )
}

export default DeleteMediaContent
