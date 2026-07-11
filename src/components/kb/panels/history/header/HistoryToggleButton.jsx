import ToggleButton from '@mui/material/ToggleButton'
import { useTheme } from '@mui/material/styles'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'

const HistoryToggleButton = ({ value, tooltip, sx }) => {
  const theme = useTheme()

  const button = (
    <ToggleButton value={value} aria-label={value} sx={{ ...theme.toggleButton, ...sx }}>
      {value}
    </ToggleButton>
  )

  return tooltip ? <KBTooltipTarget title={tooltip}>{button}</KBTooltipTarget> : button
}

export default HistoryToggleButton
