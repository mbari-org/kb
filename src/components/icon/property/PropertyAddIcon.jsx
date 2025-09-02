import { MdOutlinePlaylistAdd } from 'react-icons/md'

import PropertyActionIcon from './PropertyActionIcon'

const PropertyAddIcon = ({ onClick, size, tooltip }) => {
  return (
    <PropertyActionIcon
      color='add.main'
      Icon={MdOutlinePlaylistAdd}
      onClick={onClick}
      size={size}
      tooltip={tooltip}
    />
  )
}

export default PropertyAddIcon
