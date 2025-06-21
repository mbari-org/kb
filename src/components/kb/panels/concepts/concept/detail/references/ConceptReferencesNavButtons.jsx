import { Box, IconButton } from '@mui/material'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

const ConceptReferencesNavButtons = ({ currentPage, totalPages, onPrevious, onNext }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
    >
      <Box>
        <IconButton size='small' onClick={onPrevious} disabled={currentPage === 0}>
          <IoChevronBack />
        </IconButton>
        <IconButton size='small' onClick={onNext} disabled={currentPage >= totalPages - 1}>
          <IoChevronForward />
        </IconButton>
      </Box>
    </Box>
  )
}

export default ConceptReferencesNavButtons
