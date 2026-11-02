import { PiStamp } from 'react-icons/pi'
import ActionIcon from './ActionIcon'

const StampIcon = ({ onClick, tooltip, asDiv = false, size = 20, ...props }) => {
  return <ActionIcon Icon={PiStamp} onClick={onClick} size={size} tooltip={tooltip} asDiv={asDiv} {...props} />
}

export default StampIcon
