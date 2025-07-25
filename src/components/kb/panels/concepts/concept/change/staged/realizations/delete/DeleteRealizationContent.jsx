import { use } from 'react'
import { Box, Typography } from '@mui/material'

import Detail from '@/components/common/factory/Detail'
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
      <Typography variant='h6'>{actionText} Realization</Typography>
      <Box sx={{ ml: 2, mt: 1 }}>
        <Details id='delete-realization-content-detail' />
      </Box>
    </Box>
  )
}

export default DeleteRealizationContent
