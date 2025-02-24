import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const PendingHistoryIcon = ({ hasPendingHistory }) => {
  const { concept: conceptTheme } = useTheme()

  const dotColor = hasPendingHistory
    ? conceptTheme.color.pendingIcon.dirty
    : conceptTheme.color.pendingIcon.clean

  return (
    <Box
      sx={{
        bgcolor: dotColor,
        borderRadius: '70%',
        display: 'inline-block',
        height: 6,
        mt: 1,
        mx: 0.5,
        width: 6,
        zIndex: 1,
      }}
    />
  )
}

export default PendingHistoryIcon
