import { IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { BsInfoCircleFill } from 'react-icons/bs'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'

const KBInfoIcon = ({ tooltip, placement = 'top', size = 18, disabled = false, sx, ...props }) => {
  const theme = useTheme()

  return (
    <KBTooltipTarget title={tooltip} placement={placement}>
      <IconButton
        disabled={disabled}
        sx={{
          '&:hover': disabled
            ? {}
            : {
                ...theme.kb.icon.hover,
                backgroundColor: 'transparent',
                color: 'primary.main',
              },
          backgroundColor: 'transparent',
          color: disabled ? 'text.disabled' : 'primary.main',
          padding: 0,
          ...sx,
        }}
        {...props}
      >
        <BsInfoCircleFill size={size} />
      </IconButton>
    </KBTooltipTarget>
  )
}

export default KBInfoIcon
