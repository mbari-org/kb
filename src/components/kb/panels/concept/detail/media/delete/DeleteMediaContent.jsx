import { use } from 'react'

import DetailsContent from '@/components/common/DetailsContent'
import { createComponent } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { drop } from '@/lib/util'

const DeleteMediaContent = () => {
  const {
    stagedState: { media, mediaIndex },
  } = use(ConceptContext)

  const mediaItem = media[mediaIndex]

  const details = drop(mediaItem, ['action', 'conceptName', 'id', 'mimeType'])

  const Details = createComponent(DetailsContent, {
    details,
    sx: { ml: 1, mr: 1 },
  })

  return <Details id='delete-media-content-detail' />
}

export default DeleteMediaContent
