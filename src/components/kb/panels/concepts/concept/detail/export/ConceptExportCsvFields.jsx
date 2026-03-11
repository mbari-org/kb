import { Box, Typography } from '@mui/material'

const ConceptExportCsvFields = () => {
  return (
        <Box sx={{ pl: 2 }}>
          <Typography>• id</Typography>
          <Typography>• parentId</Typography>
          <Typography>• names (primary; aliases)</Typography>
        </Box>
  )
}

export default ConceptExportCsvFields
