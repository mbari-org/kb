import { use } from 'react'
import { Box } from '@mui/material'

import Detail from '@/components/common/factory/Detail'
import ModalActionText from '@/components/common/ModalActionText'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { actionVerb } from '@/components/kb/panels/concepts/concept/change/action'
import { drop } from '@/lib/utils'

const DeleteAliasContent = () => {
  const { modalData } = use(ConceptModalContext)
  const { aliasItem } = modalData

  const actionText = actionVerb(modalData.action)

  return (
    <Box>
      <ModalActionText text={actionText + ' Alias'} />
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
