import { use } from 'react'
import { Box } from '@mui/material'

import Detail from '@/components/common/factory/Detail'
import ModalActionText from '@/components/common/ModalActionText'

import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'

import CONFIG from '@/lib/config'

const { TEMPLATE } = CONFIG.PANELS.CONCEPTS.MODALS
const { FIELDS } = CONFIG

const DeleteTemplateContent = () => {
  const { modalData } = use(ConceptModalDataContext)

  const keys = [FIELDS.REALIZATION.LINK_NAME, FIELDS.REALIZATION.TO_CONCEPT, FIELDS.REALIZATION.LINK_VALUE]

  return (
    <Box>
      <ModalActionText text={TEMPLATE.DELETE.LABEL} />
      <Box sx={{ ml: 2, mt: 1 }}>
        <Detail id='delete-template-content-detail' detail={modalData.templateItem} keys={keys} />
      </Box>
    </Box>
  )
}

export default DeleteTemplateContent
