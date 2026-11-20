import { Box } from '@mui/material'

import ActionIcon from './ActionIcon'
import inspectPng from '@/assets/eye-32.png'
import CONFIG from '@/lib/config'

const InspectImg = ({ size }) => (
  <Box
    aria-label={CONFIG.UI.ICON.INSPECT}
    component='span'
    role='img'
    sx={{
      backgroundColor: 'currentColor',
      display: 'inline-block',
      height: size,
      maskImage: `url(${inspectPng})`,
      maskPosition: 'center',
      maskRepeat: 'no-repeat',
      maskSize: 'contain',
      WebkitMaskImage: `url(${inspectPng})`,
      WebkitMaskPosition: 'center',
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskSize: 'contain',
      width: size,
    }}
  />
)

const InspectIcon = ({ asDiv = false, color = 'primary', onClick, tooltip, ...props }) => {
  return (
    <ActionIcon
      asDiv={asDiv}
      color={color}
      Icon={InspectImg}
      onClick={onClick}
      size={22}
      tooltip={tooltip}
      {...props}
    />
  )
}

export default InspectIcon
