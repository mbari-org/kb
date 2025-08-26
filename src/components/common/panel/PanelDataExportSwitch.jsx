import { Box, FormControlLabel, Switch } from '@mui/material'

import KBTooltip from '@/components/common/KBTooltip'
import PanelDataExport from '@/components/common/panel/PanelDataExport'

const PanelDataExportSwitch = ({
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
      <PanelDataExport count={count} exportFn={exportFn} toolTip={exportToolTip} />
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

export default PanelDataExportSwitch
