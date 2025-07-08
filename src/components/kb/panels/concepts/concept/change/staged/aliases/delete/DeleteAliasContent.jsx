import { use } from 'react'

import DetailContent from '@/components/common/DetailContent'
import { createComponent } from '@/components/common/factory/createComponent'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { drop } from '@/lib/utils'

const DeleteAliasContent = () => {
  const { modalData } = use(ConceptModalContext)
  const { aliasItem } = modalData
  const detailAlias = drop(aliasItem, 'id')

  const Details = createComponent(DetailContent, {
    detail: detailAlias,
    sx: { ml: 1, mr: 1 },
  })

  return <Details id='delete-alias-content-detail' />
}

export default DeleteAliasContent
