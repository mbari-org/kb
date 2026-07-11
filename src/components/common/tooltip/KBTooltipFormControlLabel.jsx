import { FormControlLabel } from '@mui/material'

import TooltipTarget from './KBTooltipTarget'

const KBTooltipFormControlLabel = ({ tooltip, placement = 'top', ...formControlLabelProps }) => {
  return (
    <TooltipTarget title={tooltip} placement={placement}>
      <FormControlLabel {...formControlLabelProps} />
    </TooltipTarget>
  )
}

export default KBTooltipFormControlLabel
