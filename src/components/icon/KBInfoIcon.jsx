import { IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { BsInfoCircle } from 'react-icons/bs'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'

const KBInfoIcon = ({ tooltip, placement = 'top', size = 18, disabled = false, sx, ...props }) => {
  const theme = useTheme()

  return (
    <KBTooltipTarget title={tooltip} placement={placement}>
      <IconButton
        disabled={disabled}
        sx={{
          backgroundColor: disabled ? 'action.disabledBackground' : theme.palette.primary.main,
          color: disabled ? 'text.disabled' : 'white',
          padding: 0,
          '&:hover': disabled
            ? {}
            : {
                ...theme.kb.icon.hover,
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                '& svg': { color: 'white' },
              },
          ...sx,
        }}
        {...props}
      >
        <BsInfoCircle size={size} />
      </IconButton>
    </KBTooltipTarget>
  )
}

export default KBInfoIcon
