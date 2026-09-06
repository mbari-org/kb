import { use } from 'react'
import { Box } from '@mui/material'

import Detail from '@/components/common/factory/Detail'
import ModalActionText from '@/components/common/ModalActionText'

import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'

import CONFIG from '@/lib/config'

const { REALIZATION } = CONFIG.PANELS.CONCEPTS.MODALS

const DeleteRealizationContent = () => {
  const { modalData } = use(ConceptModalDataContext)
  const { realizationItem } = modalData

  const keys = ['linkName', 'toConcept', 'linkValue']

  return (
    <Box>
      <ModalActionText text={REALIZATION.DELETE.LABEL} />
      <Box sx={{ ml: 2, mt: 1 }}>
        <Detail id='delete-realization-content-detail' detail={realizationItem} keys={keys} />
      </Box>
    </Box>
  )
}

export default DeleteRealizationContent
