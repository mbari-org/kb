import { MdOutlineDeleteForever } from 'react-icons/md'

import PropertyActionIcon from './PropertyActionIcon'

const PropertyDeleteIcon = ({ onClick, size, tooltip }) => {
  return (
    <PropertyActionIcon
      color='remove'
      Icon={MdOutlineDeleteForever}
      onClick={onClick}
      size={size}
      tooltip={tooltip}
    />
  )
}

export default PropertyDeleteIcon
