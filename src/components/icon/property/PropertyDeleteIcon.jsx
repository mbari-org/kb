import { MdOutlineDeleteForever } from 'react-icons/md'

import PropertyActionIcon from './PropertyActionIcon'

const PropertyDeleteIcon = ({ colorOnHover = false, onClick, size, tooltip }) => {
  return (
    <PropertyActionIcon
      color='remove'
      colorOnHover={colorOnHover}
      Icon={MdOutlineDeleteForever}
      onClick={onClick}
      size={size}
      tooltip={tooltip}
    />
  )
}

export default PropertyDeleteIcon
