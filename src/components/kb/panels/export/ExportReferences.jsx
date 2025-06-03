import { use } from 'react'
import { Box, Typography, Button } from '@mui/material'

import ConfigContext from '@/contexts/config/ConfigContext'
import referencesExport from '@/components/kb/panels/export/referencesExport'

const ExportReferences = () => {
  const { apiFns } = use(ConfigContext)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant='h6'>References:</Typography>
      <Button onClick={() => referencesExport({ apiFns })} sx={{ mt: 0.25, fontSize: '1.25rem' }}>
        Export
      </Button>
    </Box>
  )
}

export default ExportReferences
