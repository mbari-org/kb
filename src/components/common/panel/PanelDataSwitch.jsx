import { Box, FormControlLabel, Switch } from '@mui/material'

import KBTooltip from '@/components/common/KBTooltip'

const PanelDataSwitch = ({
  checked,
  switchFn,
  switchLabel,
  switchToolTip = '',
}) => {
  return (
    <Box>
      <KBTooltip title={switchToolTip}>
        <FormControlLabel
          control={
            <Switch size='small' checked={checked} onChange={switchFn} />
          }
          label={switchLabel}
        />
      </KBTooltip>
    </Box>
  )
}

export default PanelDataSwitch
