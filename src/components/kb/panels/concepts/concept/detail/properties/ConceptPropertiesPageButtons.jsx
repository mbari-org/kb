import { Box } from '@mui/material'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

const ConceptPropertiesPageButtons = ({ currentPage, totalPages, onPrevious, onNext }) => {
  const isPreviousDisabled = currentPage === 0
  const isNextDisabled = currentPage >= totalPages - 1

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        onClick={isPreviousDisabled ? undefined : onPrevious}
        sx={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          cursor: isPreviousDisabled ? 'default' : 'pointer',
          opacity: isPreviousDisabled ? 0.38 : 1,
          '&:hover': isPreviousDisabled
            ? {}
            : {
                backgroundColor: 'action.hover',
              },
        }}
      >
        <IoChevronBack />
      </Box>
      <Box
        onClick={isNextDisabled ? undefined : onNext}
        sx={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          cursor: isNextDisabled ? 'default' : 'pointer',
          opacity: isNextDisabled ? 0.38 : 1,
          '&:hover': isNextDisabled
            ? {}
            : {
                backgroundColor: 'action.hover',
              },
        }}
      >
        <IoChevronForward />
      </Box>
    </Box>
  )
}

export default ConceptPropertiesPageButtons
