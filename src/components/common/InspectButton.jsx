import { IconButton } from '@mui/material'
import { FaRegEye } from 'react-icons/fa'

import KBTooltip from '@/components/common/KBTooltip'

const InspectButton = ({
  onClick,
  tooltip,
  size = 16,
  buttonSize = 'small',
  sx = {},
  tooltipPlacement = 'top',
  ...props
}) => {
  const icon = <FaRegEye size={size} />

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
