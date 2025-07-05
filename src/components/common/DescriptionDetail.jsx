import { Box } from '@mui/material'

import { createDetail, createText } from '@/components/common/factory/createComponent'

const DescriptionDetail = props => {
  const { description, detail } = props

  const Description = createText({
    id: 'modal-content-description',
    text: description,
    sx: {
      mb: 1,
      variant: 'h6',
      component: 'h4',
    },
  })

  const Detail = createDetail({
    id: 'modal-content-detail',
    detail,
    sx: { mb: 1, ml: 2 },
  })

  return (
    <Box>
      <Description
        id='modal-content-description'
        text={description}
        sx={{ mb: 1, variant: 'h6', component: 'h4' }}
      />
      <Detail id='modal-content-detail' detail={detail} sx={{ mb: 1, ml: 2 }} />
    </Box>
  )
}

export default DescriptionDetail
