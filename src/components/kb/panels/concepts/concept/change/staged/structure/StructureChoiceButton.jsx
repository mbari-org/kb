import { Button } from '@mui/material'

import TooltipTarget from '@/components/common/tooltip/KBTooltipTarget'

const StructureChoiceButton = ({ color = 'primary', disabled, disabledReason, onClick, text }) => {
  const button = (
    <Button variant='contained' color={color} disabled={disabled} onClick={onClick} fullWidth>
      {text}
    </Button>
  )

  if (!disabled || !disabledReason) {
    return button
  }

  return (
    <TooltipTarget title={disabledReason} wrapperSx={{ width: '100%' }}>
      {button}
    </TooltipTarget>
  )
}

export default StructureChoiceButton
