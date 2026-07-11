import { Box } from '@mui/material'

import KBTooltip from './KBTooltip'

const TooltipTarget = ({ children, title, placement = 'top', wrapper = 'span', wrapperSx = {}, ...tooltipProps }) => {
  const wrappedTarget = (
    <Box component={wrapper} sx={{ display: 'inline-flex', ...wrapperSx }}>
      {children}
    </Box>
  )
  if (!title) {
    return wrappedTarget
  }

  return (
    <KBTooltip title={title} placement={placement} {...tooltipProps}>
      {wrappedTarget}
    </KBTooltip>
  )
}

export default TooltipTarget
