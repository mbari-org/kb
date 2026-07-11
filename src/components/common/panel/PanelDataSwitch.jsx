import { Box, Switch } from '@mui/material'
import KBTooltipFormControlLabel from '@/components/common/tooltip/KBTooltipFormControlLabel'

const PanelDataSwitch = ({ checked, disabled = false, switchFn, switchLabel, switchTooltip = '' }) => {
  return (
    <Box>
      <KBTooltipFormControlLabel
        tooltip={switchTooltip}
        control={<Switch size='small' checked={checked} disabled={disabled} onChange={switchFn} />}
        label={switchLabel}
      />
    </Box>
  )
}

export default PanelDataSwitch
