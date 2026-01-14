import { useTheme } from '@mui/material/styles'

import ActionIcon from '@/components/icon/ActionIcon'
import infoIcon from '@/assets/info-48.png'

const InfoImg = ({ size }) => <img src={infoIcon} alt='Info' width={size} height={size} />

const InfoIcon = ({
  onClick,
  tooltip = 'Info',
  sx = {},
  asDiv = true,
  hoverBackground = 'transparent',
  size,
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
      Icon={InfoImg}
      onClick={onClick}
      sx={{ ...hoverSx, ...sx }}
      tooltip={tooltip}
      tooltipPlacement='top'
      size={size}
      {...props}
    />
  )
}

export default InfoIcon
