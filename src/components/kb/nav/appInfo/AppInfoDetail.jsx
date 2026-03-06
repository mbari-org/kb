import { Box, Typography } from '@mui/material'

const AppInfoDetail = ({ label, value }) => {
  return (
    <Box sx={{ display: 'flex', mb: 1 }}>
      <Typography sx={{ width: 85, flexShrink: 0 }}>{label}:</Typography>
      <Typography sx={{ fontWeight: 'bold' }}>{value}</Typography>
    </Box>
  )
}

export default AppInfoDetail
