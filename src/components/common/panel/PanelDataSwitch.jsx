import { Box, FormControlLabel, Switch } from '@mui/material'

import KBTooltip from '@/components/common/KBTooltip'

const PanelDataSwitch = ({
  checked,
  disabled = false,
  switchFn,
  switchLabel,
  switchToolTip = '',
}) => {
  return (
    <Box>
      <KBTooltip title={switchToolTip}>
        <FormControlLabel
          control={
            <Switch size='small' checked={checked} disabled={disabled} onChange={switchFn} />
          }
          label={switchLabel}
        />
      </KBTooltip>
    </Box>
  )
}

export default PanelDataSwitch
