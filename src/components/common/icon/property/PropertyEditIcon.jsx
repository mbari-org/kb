import { CiEdit } from 'react-icons/ci'

import PropertyActionIcon from './PropertyActionIcon'

const PropertyEditIcon = ({ onClick, size }) => {
  return <PropertyActionIcon color='edit.main' Icon={CiEdit} onClick={onClick} size={size} />
}

export default PropertyEditIcon
