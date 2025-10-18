import { CiEdit } from 'react-icons/ci'

import PropertyActionIcon from './PropertyActionIcon'

const PropertyEditIcon = ({ onClick, size, tooltip }) => {
  return (
    <PropertyActionIcon
      color='edit'
      Icon={CiEdit}
      onClick={onClick}
      size={size}
      tooltip={tooltip}
    />
  )
}

export default PropertyEditIcon
