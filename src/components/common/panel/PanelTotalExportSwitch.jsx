import { Box, FormControlLabel, Switch } from '@mui/material'

import KBTooltip from '@/components/common/KBTooltip'
import PanelTotalExport from '@/components/common/panel/PanelTotalExport'

const PanelTotalExportSwitch = ({
  checked,
  count,
  exportFn,
  exportToolTip,
  switchFn,
  switchLabel,
  switchToolTip = '',
  width,
  disabled = false,
}) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        width: width,
      }}
    >
      <PanelTotalExport count={count} exportFn={exportFn} toolTip={exportToolTip} />
      <Box>
        <KBTooltip title={switchToolTip}>
          <FormControlLabel
            control={
              <Switch size='small' checked={checked} onChange={switchFn} disabled={disabled} />
            }
            label={switchLabel}
          />
        </KBTooltip>
      </Box>
    </Box>
  )
}

export default PanelTotalExportSwitch
