import { Box, IconButton } from '@mui/material'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

const ConceptPropertiesNavButtons = ({ currentPage, totalPages, onPrevious, onNext }) => {
  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      <IconButton size='small' onClick={onPrevious} disabled={currentPage === 0}>
        <IoChevronBack />
      </IconButton>
      <IconButton size='small' onClick={onNext} disabled={currentPage >= totalPages - 1}>
        <IoChevronForward />
      </IconButton>
    </Box>
  )
}

export default ConceptPropertiesNavButtons
