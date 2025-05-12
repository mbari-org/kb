import { use } from 'react'

import DetailContent from '@/components/common/DetailContent'
import { createComponent } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

const DeleteAliasContent = () => {
  const {
    modalData: { alias },
  } = use(ModalContext)

  const Details = createComponent(DetailContent, {
    detail: alias,
    sx: { ml: 1, mr: 1 },
  })

  return <Details id='delete-alias-content-detail' />
}

export default DeleteAliasContent
