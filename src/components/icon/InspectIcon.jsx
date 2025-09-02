import ActionIcon from './ActionIcon'
import inspectPng from '@/assets/eye-32.png'

const InspectImg = ({ size }) => <img src={inspectPng} alt='Inspect' width={size} height={size} />

const InspectIcon = ({ asDiv = false, onClick, tooltip, ...props }) => {
  return (
    <ActionIcon
      asDiv={asDiv}
      Icon={InspectImg}
      onClick={onClick}
      size={22}
      tooltip={tooltip}
      {...props}
    />
  )
}

export default InspectIcon
