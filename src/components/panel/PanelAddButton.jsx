import { Button } from '@mui/material'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'

const PanelAddButton = ({ onClick, disabled = false, tooltip }) => {
  const button = (
    <Button color='primary' disabled={disabled} onClick={onClick} variant='contained'>
      Add
    </Button>
  )

  if (tooltip) {
    return (
      <KBTooltipTarget title={tooltip} placement='top' wrapper='span' wrapperSx={{ display: 'inline-flex' }}>
        {button}
      </KBTooltipTarget>
    )
  }

  return button
}

export default PanelAddButton
