import { Icon } from '@mui/material'
import Box from '@mui/material/Box'

import { MdOutlinePhoto } from 'react-icons/md'
import { MdOutlinePhotoLibrary } from 'react-icons/md'

const ConceptMediaIcon = ({ mediaCount, isSelected }) => {
  if (mediaCount === 0) {
    return null
  }

  const color = isSelected ? 'white' : 'main'

  const MediaIcon = mediaCount === 1 ? MdOutlinePhoto : MdOutlinePhotoLibrary

  return (
    <Box sx={{ ml: 0.5, mr: 1 }}>
      <Icon color={color} component={MediaIcon} sx={{ fontSize: 14, mb: 1 }} />
    </Box>
  )
}

export default ConceptMediaIcon
