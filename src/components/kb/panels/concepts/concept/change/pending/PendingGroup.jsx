import { Box } from '@mui/material'

const PendingGroup = ({ pendingGroupTitle, pendingGroupDetail }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>{pendingGroupTitle}</Box>
      {pendingGroupDetail}
    </Box>
  )
}

export default PendingGroup
