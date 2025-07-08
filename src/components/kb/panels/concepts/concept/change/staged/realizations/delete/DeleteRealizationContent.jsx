import { use } from 'react'

import DetailContent from '@/components/common/DetailContent'
import { createComponent } from '@/components/common/factory/createComponent'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { drop } from '@/lib/utils'

const DeleteRealizationContent = () => {
  const { modalData } = use(ConceptModalContext)
  const { realizationItem } = modalData
  const detailRealization = drop(realizationItem, 'id')

  const Details = createComponent(DetailContent, {
    detail: detailRealization,
    sx: { ml: 1, mr: 1 },
  })

  return <Details id='delete-realization-content-detail' />
}

export default DeleteRealizationContent
