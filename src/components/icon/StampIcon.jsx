import { PiStamp } from 'react-icons/pi'
import ActionIcon from './ActionIcon'

const StampIcon = ({ onClick, tooltip, asDiv = false, ...props }) => {
  return <ActionIcon Icon={PiStamp} onClick={onClick} tooltip={tooltip} asDiv={asDiv} {...props} />
}

export default StampIcon
