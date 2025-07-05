import { Box, IconButton } from '@mui/material'
import { FaRegEye } from 'react-icons/fa'

import KBTooltip from '@/components/common/KBTooltip'

const InspectButton = ({
  onClick,
  tooltip,
  size = 16,
  buttonSize = 'small',
  sx = {},
  tooltipPlacement = 'top',
  asDiv = false,
  ...props
}) => {
  const icon = <FaRegEye size={size} />

  if (asDiv) {
    // Render as a div to avoid button nesting
    const divElement = (
      <Box
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px',
          borderRadius: '50%',
          '&:hover': {
            color: 'primary.main',
            '& svg': {
              transform: 'scale(1.2)',
            },
            ...(sx['&:hover'] || {}),
          },
          ...sx,
        }}
        title={tooltip}
        {...props}
      >
        {icon}
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
      size={buttonSize}
      onClick={onClick}
      sx={{
        ...sx,
        '&:hover': {
          color: 'primary.main',
          '& svg': {
            transform: 'scale(1.2)',
          },
          ...(sx['&:hover'] || {}),
        },
      }}
      {...props}
    >
      {icon}
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

export default InspectButton
