import { use } from 'react'
import { Box, Typography } from '@mui/material'

import Detail from '@/components/common/factory/Detail'
import ModalActionText from '@/components/common/ModalActionText'
import { createComponent } from '@/components/common/factory/createComponent'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { drop } from '@/lib/utils'

const DeleteAliasContent = () => {
  const { modalData } = use(ConceptModalContext)
  const { aliasItem } = modalData

  const actionText = modalData.action.split(' ').pop()

  const Details = createComponent(Detail, {
    detail: drop(aliasItem, 'id'),
  })

  return (
    <Box>
      <ModalActionText text={`${actionText} Alias`} />
      <Box sx={{ ml: 2, mt: 1 }}>
        <Details id='delete-alias-content-detail' />
      </Box>
    </Box>
  )
}

export default DeleteAliasContent
