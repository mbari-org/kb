import { CiEdit } from 'react-icons/ci'

import PropertyActionIcon from './PropertyActionIcon'

const PropertyEditIcon = ({ colorOnHover = false, onClick, size, tooltip }) => {
  return (
    <PropertyActionIcon
      color='edit'
      colorOnHover={colorOnHover}
      Icon={CiEdit}
      onClick={onClick}
      size={size}
      tooltip={tooltip}
    />
  )
}

export default PropertyEditIcon
