import { use } from 'react'

import DetailsContent from '@/components/common/DetailsContent'
import { createComponent } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

const DeleteAliasContent = () => {
  const {
    modalData: { alias },
  } = use(ModalContext)

  const Details = createComponent(DetailsContent, {
    details: alias,
    sx: { ml: 1, mr: 1 },
  })

  return <Details id='delete-alias-content-detail' />
}

export default DeleteAliasContent
