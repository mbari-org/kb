import { Box, IconButton, useTheme } from '@mui/material'

import KBTooltip from '@/components/common/KBTooltip'

const SIZE = 16
const BUTTON_SIZE = 'small'

const ActionIcon = ({
  asDiv = false,
  Icon,
  onClick,
  sx = {},
  tooltip,
  tooltipPlacement = 'top',
  ...props
}) => {
  const theme = useTheme()

  // Render the icon component with consistent size
  const sizedIcon = <Icon size={SIZE} />

  if (asDiv) {
    const divElement = (
      <Box
        onClick={onClick}
        sx={{
          alignItems: 'center',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          padding: '4px',
          '&:hover': theme.kb?.icon?.hover,
          ...sx,
        }}
        title={tooltip}
        {...props}
      >
        {sizedIcon}
      </Box>
    )

    if (tooltip) {
      return (
        <KBTooltip title={tooltip} placement={tooltipPlacement}>
          {divElement}
        </KBTooltip>
      )
    }

    return divElement
  }

  const button = (
    <IconButton
      size={BUTTON_SIZE}
      onClick={onClick}
      sx={{
        ...sx,
        '&:hover': theme.kb?.icon?.hover,
      }}
      {...props}
    >
      {sizedIcon}
    </IconButton>
  )

  if (tooltip) {
    return (
      <KBTooltip title={tooltip} placement={tooltipPlacement}>
        {button}
      </KBTooltip>
    )
  }

  return button
}

export default ActionIcon
