import { use } from 'react'

import DetailContent from '@/components/common/DetailContent'
import { createComponent } from '@/components/modal/panelModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { drop } from '@/lib/utils'

const DeleteMediaContent = () => {
  const {
    stagedState: { media, mediaIndex },
  } = use(ConceptContext)

  const mediaItem = media[mediaIndex]

  const detail = drop(mediaItem, ['action', 'conceptName', 'id', 'mimeType'])

  const Details = createComponent(DetailContent, {
    detail,
    sx: { ml: 1, mr: 1 },
  })

  return <Details id='delete-media-content-detail' />
}

export default DeleteMediaContent
