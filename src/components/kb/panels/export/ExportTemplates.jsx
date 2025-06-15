import { use } from 'react'
import { Box, Typography, Button } from '@mui/material'

import ConfigContext from '@/contexts/config/ConfigContext'
import templatesExport from '@/components/kb/panels/export/templatesExport'

const ExportTemplates = () => {
  const { apiFns } = use(ConfigContext)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant='h6'>Templates:</Typography>
      <Button onClick={() => templatesExport({ apiFns })} sx={{ mt: 0.25, fontSize: '1.25rem' }}>
        Export
      </Button>
    </Box>
  )
}

export default ExportTemplates
