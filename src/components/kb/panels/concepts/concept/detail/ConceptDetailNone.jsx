import { Box, Typography } from '@mui/material'

const ConceptDetailNone = ({ display }) => {
  return display ? (
    <Box sx={{ ml: 1 }}>
      <Typography>None</Typography>
    </Box>
  ) : null
}

export default ConceptDetailNone
