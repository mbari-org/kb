import { IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { BsInfoCircle } from 'react-icons/bs'

import KBTooltip from '@/components/common/KBTooltip'

/**
 * KBInfoIcon component - a standardized info icon with tooltip
 *
 * @param {Object} props
 * @param {React.ReactNode} props.tooltip - The tooltip content (required)
 * @param {string} props.placement - Tooltip placement (default: 'top')
 * @param {number} props.size - Icon size (default: 18)
 * @param {boolean} props.disabled - Whether the icon is disabled (default: false)
 * @param {Object} props.sx - Custom styles to override default IconButton styling
 * @param {...Object} props - All other props are passed through to IconButton
 */
const KBInfoIcon = ({ tooltip, placement = 'top', size = 18, disabled = false, sx, ...props }) => {
  const theme = useTheme()

  return (
    <KBTooltip title={tooltip} placement={placement}>
      <IconButton
        disabled={disabled}
        sx={{
          backgroundColor: disabled ? 'action.disabledBackground' : theme.palette.primary.main,
          color: disabled ? 'text.disabled' : 'white',
          padding: 0,
          '&:hover': disabled ? {} : {
            ...theme.kb.icon.hover,
            backgroundColor: theme.palette.primary.main,
          },
          ...sx, // Allow custom styles to override defaults
        }}
        {...props}
      >
        <BsInfoCircle size={size} />
      </IconButton>
    </KBTooltip>
  )
}

export default KBInfoIcon
