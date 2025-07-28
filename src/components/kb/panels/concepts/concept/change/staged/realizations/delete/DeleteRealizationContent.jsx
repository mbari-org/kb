import { use } from 'react'
import { Box } from '@mui/material'

import Detail from '@/components/common/factory/Detail'
import ModalActionText from '@/components/common/ModalActionText'
import { createComponent } from '@/components/common/factory/createComponent'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

const DeleteRealizationContent = () => {
  const { modalData } = use(ConceptModalContext)
  const { realizationItem } = modalData

  const actionText = modalData.action.split(' ').pop()

  const keys = ['linkName', 'toConcept', 'linkValue']
  const Details = createComponent(Detail, {
    detail: realizationItem,
    keys,
  })

  return (
    <Box>
      <ModalActionText text={`${actionText} Realization`} />
      <Box sx={{ ml: 2, mt: 1 }}>
        <Details id='delete-realization-content-detail' />
      </Box>
    </Box>
  )
}

export default DeleteRealizationContent
