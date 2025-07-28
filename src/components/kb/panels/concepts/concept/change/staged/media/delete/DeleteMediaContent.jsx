import { use } from 'react'
import { Box, Typography } from '@mui/material'

import Detail from '@/components/common/factory/Detail'
import { createComponent } from '@/components/common/factory/createComponent'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { drop } from '@/lib/utils'

const DeleteMediaContent = () => {
  const {
    stagedState: { media, mediaIndex },
  } = use(ConceptContext)
  const { modalData } = use(ConceptModalContext)

  const mediaItem = media[mediaIndex]
  const actionText = modalData.action.split(' ').pop()

  const detail = drop(mediaItem, ['action', 'conceptName', 'id', 'mimeType'])

  const Details = createComponent(Detail, {
    detail,
  })

  return (
    <Box>
      <Typography variant='h6'>{actionText} Media</Typography>
      <Box sx={{ ml: 2, mt: 1 }}>
        <Details id='delete-media-content-detail' />
      </Box>
    </Box>
  )
}

export default DeleteMediaContent
