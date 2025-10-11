import { use } from 'react'
import { Box } from '@mui/material'

import Detail from '@/components/common/factory/Detail'
import ModalActionText from '@/components/common/ModalActionText'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { actionVerb } from '@/components/kb/panels/concepts/concept/change/action'

const DeleteRealizationContent = () => {
  const { modalData } = use(ConceptModalContext)
  const { realizationItem } = modalData

  const actionText = actionVerb(modalData.action)

  const keys = ['linkName', 'toConcept', 'linkValue']

  return (
    <Box>
      <ModalActionText text={actionText + ' Realization'} />
      <Box sx={{ ml: 2, mt: 1 }}>
        <Detail
          id='delete-realization-content-detail'
          detail={realizationItem}
          keys={keys}
        />
      </Box>
    </Box>
  )
}

export default DeleteRealizationContent
