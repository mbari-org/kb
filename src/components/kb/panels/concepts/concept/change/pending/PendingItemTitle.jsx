import { Box, Typography } from '@mui/material'

const PendingItemTitle = ({ sx, action, title }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography sx={sx}>{action}:</Typography>
      <Typography sx={{ ...sx, fontWeight: 'bold', ml: 1 }}>
        {title}
      </Typography>
    </Box>
  )
}

export default PendingItemTitle
