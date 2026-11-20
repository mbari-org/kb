import { Box, Switch } from '@mui/material'
import KBTooltipFormControlLabel from '@/components/common/tooltip/KBTooltipFormControlLabel'

const PanelDataSwitch = ({ checked, disabled = false, switchFn, switchLabel, switchTooltip = '' }) => {
  return (
    <Box>
      <KBTooltipFormControlLabel
        tooltip={switchTooltip}
        control={
          <Switch
            checked={checked}
            disabled={disabled}
            onChange={switchFn}
            size='small'
            sx={{
              '& .MuiSwitch-switchBase:not(.Mui-checked):not(.Mui-disabled)': {
                color: 'grey.700',
                '& + .MuiSwitch-track': {
                  backgroundColor: 'grey.700',
                  opacity: 0.5,
                },
              },
            }}
          />
        }
        label={switchLabel}
      />
    </Box>
  )
}

export default PanelDataSwitch
