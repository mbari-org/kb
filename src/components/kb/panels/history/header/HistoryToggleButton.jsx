import ToggleButton from '@mui/material/ToggleButton'
import { useTheme } from '@mui/material/styles'

import KBTooltip from '@/components/common/KBTooltip'

const HistoryToggleButton = ({ value, tooltip, sx }) => {
  const theme = useTheme()

  const button = (
    <ToggleButton value={value} aria-label={value} sx={{ ...theme.toggleButton, ...sx }}>
      {value}
    </ToggleButton>
  )

  return tooltip ? <KBTooltip title={tooltip}>{button}</KBTooltip> : button
}

export default HistoryToggleButton
