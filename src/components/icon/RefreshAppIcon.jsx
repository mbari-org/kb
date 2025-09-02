import { useTheme } from '@mui/material/styles'
import ActionIcon from '@/components/icon/ActionIcon'
import refreshIcon from '@/assets/refresh.svg'

const RefreshImg = ({ size }) => (
  <img src={refreshIcon} alt='Refresh App' width={size} height={size} />
)

const RefreshAppIcon = ({
  asDiv = true,
  hoverBackground = 'transparent', // 'transparent' or 'primary.main'
  onClick,
  size,
  sx = {},
  tooltip = 'Refresh App',
  ...props
}) => {
  const theme = useTheme()

  const hoverSx = {
    '&:hover': {
      ...(theme.kb?.icon?.hover || {}),
      backgroundColor: hoverBackground,
    },
  }

  return (
    <ActionIcon
      asDiv={asDiv}
      Icon={RefreshImg}
      onClick={onClick}
      size={size}
      sx={{ ...hoverSx, ...sx }}
      tooltip={tooltip}
      tooltipPlacement='top'
      {...props}
    />
  )
}

export default RefreshAppIcon
