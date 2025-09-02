import { Box, IconButton, useTheme } from '@mui/material'

import KBTooltip from '@/components/common/KBTooltip'

const SIZE = 16
const BUTTON_SIZE = 'small'

const ActionIcon = ({
  asDiv = false,
  color,
  Icon,
  onClick,
  size = SIZE,
  sx = {},
  tooltip,
  tooltipPlacement = 'top',
  ...props
}) => {
  const theme = useTheme()

  const hoverColor = color
    ? theme.palette[color]?.main || theme.palette.primary.main
    : theme.palette.primary.main

  const sizedIcon = <Icon size={size} />

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
          '&:hover': {
            ...theme.kb?.icon?.hover,
            ...(color && { color: hoverColor }),
          },
          ...sx,
        }}
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
        '&:hover': {
          ...theme.kb?.icon?.hover,
          ...(color && { color: hoverColor }),
        },
        ...sx,
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
