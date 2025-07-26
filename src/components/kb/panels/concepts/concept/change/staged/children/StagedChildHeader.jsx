import { Box, Typography } from '@mui/material'

const StagedChildHeader = ({ initialChild, stagedChild }) => {
  const { updates } = stagedChild
  const childName = initialChild?.name || updates?.name

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography>Add Child:</Typography>
      <Typography sx={{ fontWeight: 'bold' }}>{childName}</Typography>
    </Box>
  )
}

export default StagedChildHeader
