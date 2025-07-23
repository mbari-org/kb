import { Box, Typography } from '@mui/material'

const StagedRealizationHeader = ({ stagedRealization }) => {
  const { action } = stagedRealization
  const actionText = `${action.split(' ').pop()}`

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography>{actionText}</Typography>
    </Box>
  )
}

export default StagedRealizationHeader
