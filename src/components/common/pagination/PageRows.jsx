import { Box, Typography } from '@mui/material'

const PageRows = ({ count, limit, offset }) => (
  <Box sx={{ flex: 1, textAlign: 'center' }}>
    <Typography variant='body2'>
      Row {offset + 1} - {Math.min(offset + limit, count)} of {count}
    </Typography>
  </Box>
)

export default PageRows
