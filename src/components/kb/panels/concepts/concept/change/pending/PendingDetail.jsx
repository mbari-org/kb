import { Box } from '@mui/material'

const PendingDetail = ({ pendingDetailTitle, pendingDetailValues }) => {
  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        mt: 0.5,
      }}
    >
      <Box sx={{ alignItems: 'center', display: 'flex', ml: 3.4 }}>{pendingDetailTitle}</Box>
      {pendingDetailValues}
    </Box>
  )
}

export default PendingDetail
