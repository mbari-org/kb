import ToggleButton from '@mui/material/ToggleButton'
import { useTheme } from '@mui/material/styles'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'

const HistoryToggleButton = ({ tooltip, sx, value }) => {
  const theme = useTheme()

  return (
    <KBTooltipTarget placement='bottom' title={tooltip}>
      <ToggleButton value={value} aria-label={value} sx={{ ...theme.toggleButton, ...sx }}>
        {value}
      </ToggleButton>
    </KBTooltipTarget>
  )
}

export default HistoryToggleButton
