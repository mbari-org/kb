import { use } from 'react'
import { Box, Typography } from '@mui/material'

import AppModalContext from '@/contexts/app/AppModalContext'

import CONFIG from '@/lib/config'

const ExportCompleteContent = () => {
  const { modalData } = use(AppModalContext)
  const fileName = modalData?.fileName || 'export.csv'
  const [before, after] = CONFIG.EXPORT.COMPLETE.EXPORTED_AS.split('{file}')

  return (
    <Box sx={{ minWidth: 360, p: 1 }}>
      <Typography variant='body1'>
        {before}
        <strong>{fileName}</strong>
        {after}
      </Typography>
    </Box>
  )
}

export default ExportCompleteContent
