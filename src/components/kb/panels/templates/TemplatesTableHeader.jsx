import { use } from 'react'
import { Box, Typography } from '@mui/material'

import PanelTitle from '@/components/common/PanelTitle'

import TemplatesContext from '@/contexts/templates/TemplatesContext'

const TemplatesHeader = () => {
  const { count } = use(TemplatesContext)

  return (
    <Box>
      <PanelTitle title='Templates' />
      <Typography sx={{ ml: 2, mt: 1.25 }}>Total: {count}</Typography>
    </Box>
  )
}

export default TemplatesHeader
