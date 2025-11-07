import { Box, Typography } from '@mui/material'

const ConceptExportCsv = () => {
  return (
        <Box sx={{ pl: 2 }}>
          <Typography variant='body2'>• id</Typography>
          <Typography variant='body2'>• parentId</Typography>
          <Typography variant='body2'>• names (primary; aliases)</Typography>
        </Box>
  )
}

export default ConceptExportCsv
