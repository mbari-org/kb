import { Box } from '@mui/material'

import Detail from '@/components/common/factory/Detail'
import Text from '@/components/common/factory/Text'

const DescriptionDetail = props => {
  const { description, detail } = props

  return (
    <Box>
      <Text
        id='modal-content-description'
        text={description}
        sx={{
          mb: 1,
          variant: 'h6',
          component: 'h4',
        }}
      />
      <Detail
        id='modal-content-detail'
        detail={detail}
        sx={{ mb: 1, ml: 2 }}
      />
    </Box>
  )
}

export default DescriptionDetail
