import { Box, Button } from '@mui/material'
import KBTooltip from '@/components/common/KBTooltip'

const PanelAddButton = ({ onClick, disabled = false, tooltip }) => {
  const button = (
    <Button color='primary' disabled={disabled} onClick={onClick} variant='contained'>
      Add
    </Button>
  )

  if (tooltip) {
    // Wrap disabled button in a span for tooltip to work on disabled buttons
    return (
      <KBTooltip title={tooltip} placement='top'>
        <Box component='span'>{button}</Box>
      </KBTooltip>
    )
  }

  return button
}

export default PanelAddButton
