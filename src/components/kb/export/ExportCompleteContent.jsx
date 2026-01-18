import { use } from 'react'
import { Box, Typography } from '@mui/material'

import AppModalContext from '@/contexts/app/AppModalContext'

const ExportCompleteContent = () => {
  const { modalData } = use(AppModalContext)
  const fileName = modalData?.fileName || 'export.csv'

  return (
    <Box sx={{ minWidth: 360, p: 1 }}>
      <Typography variant='body1'>
        Exported as <strong>{fileName}</strong>.
      </Typography>
    </Box>
  )
}

export default ExportCompleteContent
