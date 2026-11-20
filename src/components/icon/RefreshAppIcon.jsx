import { useTheme } from '@mui/material/styles'
import ActionIcon from '@/components/icon/ActionIcon'
import refreshIcon from '@/assets/refresh-48.png'
import CONFIG from '@/lib/config'

const { REFRESH_APP } = CONFIG.UI.ICON

const RefreshImg = ({ size }) => (
  <img src={refreshIcon} alt={REFRESH_APP} width={size} height={size} />
)

const RefreshAppIcon = ({
  asDiv = true,
  hoverBackground = 'transparent', // 'transparent' or 'primary.main'
  onClick,
  size,
  sx = {},
  tooltip = REFRESH_APP,
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
