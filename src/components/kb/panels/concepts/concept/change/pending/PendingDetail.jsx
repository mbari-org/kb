import { Box } from '@mui/material'

const PendingDetail = ({ pendingDetailButtons, pendingDetailExtras, pendingDetailTitle, pendingDetailValues }) => {
  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        mt: 0.5,
      }}
    >
      {pendingDetailButtons ? (
        <Box sx={{ alignItems: 'flex-start', display: 'flex', ml: 3.4 }}>
          {pendingDetailButtons}
          <Box>
            {pendingDetailTitle}
            {pendingDetailValues}
          </Box>
        </Box>
      ) : (
        <>
          <Box sx={{ alignItems: 'center', display: 'flex', ml: 3.4 }}>{pendingDetailTitle}</Box>
          {pendingDetailValues}
        </>
      )}
      {pendingDetailExtras}
    </Box>
  )
}

export default PendingDetail
