import { Box, Typography } from '@mui/material'

import CONFIG from '@/lib/config'

const PageRows = ({ count, limit, offset }) => {
  const rows = CONFIG.UI.PAGINATION.ROWS.replace('{start}', offset + 1)
    .replace('{end}', Math.min(offset + limit, count))
    .replace('{count}', count)

  return (
    <Box sx={{ flex: 1, textAlign: 'center' }}>
      <Typography variant='body2'>{rows}</Typography>
    </Box>
  )
}

export default PageRows
