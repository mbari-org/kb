import { use } from 'react'
import { Box, IconButton, useTheme } from '@mui/material'

import KBTooltip from '@/components/common/KBTooltip'
import UserContext from '@/contexts/user/UserContext'
import { isReadOnly } from '@/lib/auth/role'

const SIZE = 16
const BUTTON_SIZE = 'small'

const ActionIcon = ({
  asDiv = false,
  color,
  Icon,
  onClick,
  restrictReadOnly = false,
  size = SIZE,
  sx = {},
  tooltip,
  tooltipPlacement = 'top',
  ...props
}) => {
  const theme = useTheme()
  const { user } = use(UserContext)

  const isDisabled = restrictReadOnly && isReadOnly(user)

  const hoverColor = color
    ? theme.palette[color]?.main || theme.palette.primary.main
    : theme.palette.primary.main

  const sizedIcon = <Icon size={size} />

  if (asDiv) {
    const divElement = (
      <Box
        onClick={isDisabled ? undefined : onClick}
        sx={{
          alignItems: 'center',
          borderRadius: '50%',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'center',
          opacity: isDisabled ? 0.5 : 1,
          padding: '4px',
          '&:hover': {
            ...(isDisabled ? {} : theme.kb?.icon?.hover),
            ...(color && !isDisabled && { color: hoverColor }),
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
      disabled={isDisabled}
      onClick={onClick}
      sx={{
        '&:hover': {
          ...(isDisabled ? {} : theme.kb?.icon?.hover),
          ...(color && !isDisabled && { color: hoverColor }),
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
