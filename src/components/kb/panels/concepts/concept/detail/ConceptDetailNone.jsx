import { Box, Typography } from '@mui/material'

const ConceptDetailNone = ({ display }) => {
  return display ? (
    <Box sx={{ ml: 2 }}>
      <Typography>None</Typography>
    </Box>
  ) : null
}

export default ConceptDetailNone
