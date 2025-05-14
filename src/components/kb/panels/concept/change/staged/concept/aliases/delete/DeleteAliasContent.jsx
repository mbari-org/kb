import { use } from 'react'

import DetailContent from '@/components/common/DetailContent'
import { createComponent } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

import { drop } from '@/lib/util'

const DeleteAliasContent = () => {
  const { modalData } = use(ModalContext)
  const { alias } = modalData
  const detailAlias = drop(alias, 'id')

  const Details = createComponent(DetailContent, {
    detail: detailAlias,
    sx: { ml: 1, mr: 1 },
  })

  return <Details id='delete-alias-content-detail' />
}

export default DeleteAliasContent
