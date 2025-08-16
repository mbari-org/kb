import { FaRegEye } from 'react-icons/fa'

import ActionIcon from './ActionIcon'

const InspectIcon = ({ onClick, tooltip, asDiv = false, ...props }) => {
  return <ActionIcon Icon={FaRegEye} onClick={onClick} tooltip={tooltip} asDiv={asDiv} {...props} />
}

export default InspectIcon
