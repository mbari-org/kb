import { Button } from '@mui/material'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'

import CONFIG from '@/lib/config'

const PanelAddButton = ({ onClick, disabled = false, tooltip, label = CONFIG.BUTTON.ADD }) => {
  const button = (
    <Button color='primary' disabled={disabled} onClick={onClick} variant='contained'>
      {label}
    </Button>
  )

  if (tooltip) {
    return (
      <KBTooltipTarget title={tooltip} placement='bottom' wrapper='span' wrapperSx={{ display: 'inline-flex' }}>
        {button}
      </KBTooltipTarget>
    )
  }

  return button
}

export default PanelAddButton
