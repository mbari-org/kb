import { Box, FormControlLabel, Switch } from '@mui/material'

import KBTooltip from '@/components/common/KBTooltip'
import PanelTotalExport from '@/components/common/panel/PanelTotalExport'

const PanelTotalExportSwitch = ({
  checked,
  count,
  exportFn,
  handleToggleChange,
  exportToolTip,
  switchLabel,
  switchToolTip,
  width,
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
            control={<Switch size='small' checked={checked} onChange={handleToggleChange} />}
            label={switchLabel}
          />
        </KBTooltip>
      </Box>
    </Box>
  )
}

export default PanelTotalExportSwitch
