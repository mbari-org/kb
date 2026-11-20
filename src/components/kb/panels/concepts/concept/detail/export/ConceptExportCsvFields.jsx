import { Box, Typography } from '@mui/material'

import CONFIG from '@/lib/config'

const { ID, NAMES, PARENT_ID } = CONFIG.PANELS.CONCEPTS.EXPORT.CSV_FIELDS

const ConceptExportCsvFields = () => {
  return (
    <Box sx={{ pl: 2 }}>
      <Typography>{ID}</Typography>
      <Typography>{PARENT_ID}</Typography>
      <Typography>{NAMES}</Typography>
    </Box>
  )
}

export default ConceptExportCsvFields
