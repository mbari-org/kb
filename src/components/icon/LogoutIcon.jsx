import { useTheme } from '@mui/material/styles'

import ActionIcon from '@/components/icon/ActionIcon'
import logoutPng from '@/assets/logout-48.png'

const LogoutImg = ({ size }) => <img src={logoutPng} alt='Logout' width={size} height={size} />

const LogoutIcon = ({
  onClick,
  tooltip = 'Logout',
  sx = {},
  asDiv = true,
  hoverBackground = 'transparent', // e.g., 'transparent' or 'primary.main'
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
      Icon={LogoutImg}
      onClick={onClick}
      sx={{ ...hoverSx, ...sx }}
      tooltip={tooltip}
      tooltipPlacement='top'
      {...props}
    />
  )
}

export default LogoutIcon
