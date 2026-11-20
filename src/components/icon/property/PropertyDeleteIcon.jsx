import { MdOutlineDeleteForever } from 'react-icons/md'

import PropertyActionIcon from './PropertyActionIcon'

const PropertyDeleteIcon = ({ onClick, size, tooltip }) => {
  return (
    <PropertyActionIcon
      iconAction='DELETE'
      Icon={MdOutlineDeleteForever}
      onClick={onClick}
      size={size}
      tooltip={tooltip}
    />
  )
}

export default PropertyDeleteIcon
