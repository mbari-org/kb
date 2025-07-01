import { use } from 'react'

import DetailContent from '@/components/common/DetailContent'
import { createComponent } from '@/components/common/factory/createComponent'

import HOLDModalContext from '@/contexts/modal/panel/HOLDModalContext'

import { drop } from '@/lib/utils'

const DeleteAliasContent = () => {
  const { modalData } = use(HOLDModalContext)
  const { alias } = modalData
  const detailAlias = drop(alias, 'id')

  const Details = createComponent(DetailContent, {
    detail: detailAlias,
    sx: { ml: 1, mr: 1 },
  })

  return <Details id='delete-alias-content-detail' />
}

export default DeleteAliasContent
