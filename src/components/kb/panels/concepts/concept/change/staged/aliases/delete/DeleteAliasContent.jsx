import { use } from 'react'
import { Box } from '@mui/material'

import Detail from '@/components/common/factory/Detail'
import ModalActionText from '@/components/common/ModalActionText'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { drop } from '@/lib/utils'
import CONFIG from '@/text'

const { ALIAS } = CONFIG.PANELS.CONCEPTS.MODALS

const DeleteAliasContent = () => {
  const { modalData } = use(ConceptModalContext)
  const { aliasItem } = modalData

  return (
    <Box>
      <ModalActionText text={ALIAS.DELETE.LABEL} />
      <Box sx={{ ml: 2, mt: 1 }}>
        <Detail
          id='delete-alias-content-detail'
          detail={drop(aliasItem, 'id')}
        />
      </Box>
    </Box>
  )
}

export default DeleteAliasContent
