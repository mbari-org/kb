import { MdOutlineDeleteForever } from 'react-icons/md'

import PropertyActionIcon from './PropertyActionIcon'

const PropertyAddIcon = ({ onClick, size }) => {
  return (
    <PropertyActionIcon
      color='remove.main'
      Icon={MdOutlineDeleteForever}
      onClick={onClick}
      size={size}
    />
  )
}

export default PropertyAddIcon
