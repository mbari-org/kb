import { MdOutlinePlaylistAdd } from 'react-icons/md'

import PropertyActionIcon from './PropertyActionIcon'

const PropertyAddIcon = ({ onClick, size, tooltip }) => {
  return (
    <PropertyActionIcon
      iconAction='ADD'
      Icon={MdOutlinePlaylistAdd}
      onClick={onClick}
      size={size}
      tooltip={tooltip}
    />
  )
}

export default PropertyAddIcon
