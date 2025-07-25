import { use } from 'react'

import Detail from '@/components/common/factory/Detail'
import { createComponent } from '@/components/common/factory/createComponent'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { drop } from '@/lib/utils'

const DeleteMediaContent = () => {
  const {
    stagedState: { media, mediaIndex },
  } = use(ConceptContext)

  const mediaItem = media[mediaIndex]

  const detail = drop(mediaItem, ['action', 'conceptName', 'id', 'mimeType'])

  const Details = createComponent(Detail, {
    detail,
    sx: { ml: 1, mr: 1 },
  })

  return <Details id='delete-media-content-detail' />
}

export default DeleteMediaContent
