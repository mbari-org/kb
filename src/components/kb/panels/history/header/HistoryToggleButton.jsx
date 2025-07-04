import ToggleButton from '@mui/material/ToggleButton'
import { useTheme } from '@mui/material/styles'

const HistoryToggleButton = ({ value, sx }) => {
  const theme = useTheme()

  return (
    <ToggleButton value={value} aria-label={value} sx={{ ...theme.toggleButton, ...sx }}>
      {value}
    </ToggleButton>
  )
}

export default HistoryToggleButton
