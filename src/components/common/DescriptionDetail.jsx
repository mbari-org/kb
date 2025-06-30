import { Box } from '@mui/material'

import { createDetail, createText } from '@/components/common/factory/createComponent'

const DescriptionDetail = props => {
  const { description, detail } = props

  const Description = createText({
    id: 'modal-content-description',
    description,
    sx: { mb: 1 },
  })

  const Detail = createDetail({
    id: 'modal-content-detail',
    detail,
    sx: { mb: 1, ml: 2 },
  })

  return (
    <Box>
      <Description id='modal-content-description' description={description} sx={{ mb: 1 }} />
      <Detail id='modal-content-detail' detail={detail} sx={{ mb: 1, ml: 2 }} />
    </Box>
  )
}

export default DescriptionDetail
