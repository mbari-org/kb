import { Box, IconButton } from '@mui/material'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

const ConceptPropertiesPageButtons = ({ currentPage, totalPages, onPrevious, onNext }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <IconButton onClick={onPrevious} disabled={currentPage === 0} sx={{ width: 32, height: 32 }}>
        <IoChevronBack />
      </IconButton>
      <IconButton
        onClick={onNext}
        disabled={currentPage >= totalPages - 1}
        sx={{ width: 32, height: 32 }}
      >
        <IoChevronForward />
      </IconButton>
    </Box>
  )
}

export default ConceptPropertiesPageButtons
