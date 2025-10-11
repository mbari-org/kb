import { use } from 'react'
import { Box } from '@mui/material'

import Detail from '@/components/common/factory/Detail'
import ModalActionText from '@/components/common/ModalActionText'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { drop } from '@/lib/utils'

import { actionVerb } from '@/components/kb/panels/concepts/concept/change/action'

const DeleteMediaContent = () => {
  const {
    stagedState: { media, mediaIndex },
  } = use(ConceptContext)
  const { modalData } = use(ConceptModalContext)

  const mediaItem = media[mediaIndex]
  const actionText = actionVerb(modalData.action)

  const detail = drop(mediaItem, ['action', 'conceptName', 'id', 'mimeType'])

  return (
    <Box>
      <ModalActionText text={actionText + ' Media'} />
      <Box sx={{ ml: 2, mt: 1 }}>
        <Detail id='delete-media-content-detail' detail={detail} />
      </Box>
    </Box>
  )
}

export default DeleteMediaContent
