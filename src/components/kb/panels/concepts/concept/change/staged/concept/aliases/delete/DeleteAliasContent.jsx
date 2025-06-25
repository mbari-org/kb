import { use } from 'react'

import DetailContent from '@/components/common/DetailContent'
import { createComponent } from '@/components/modal/factory'

import PanelModalContext from '@/contexts/modal/PanelModalContext'

import { drop } from '@/lib/utils'

const DeleteAliasContent = () => {
  const { modalData } = use(PanelModalContext)
  const { alias } = modalData
  const detailAlias = drop(alias, 'id')

  const Details = createComponent(DetailContent, {
    detail: detailAlias,
    sx: { ml: 1, mr: 1 },
  })

  return <Details id='delete-alias-content-detail' />
}

export default DeleteAliasContent
