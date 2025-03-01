import { CiEdit } from 'react-icons/ci'

import { IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const ChangeStructureButton = ({ onClick }) => {
  const theme = useTheme()

  return (
    <IconButton
      aria-label='Edit concept name'
      color='main'
      onClick={onClick}
      sx={{
        mb: 2,
        ml: 0.5,
        padding: 0,
        '&:hover': {
          ...theme.kb.icon.hover,
        },
      }}
    >
      <CiEdit size={24} />
    </IconButton>
  )
}

export default ChangeStructureButton
