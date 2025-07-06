import { MdOutlinePlaylistAdd } from 'react-icons/md'

import PropertyActionIcon from './PropertyActionIcon'

const PropertyAddIcon = ({ onClick, size }) => {
  return (
    <PropertyActionIcon
      color='add.main'
      Icon={MdOutlinePlaylistAdd}
      onClick={onClick}
      size={size}
    />
  )
}

export default PropertyAddIcon
