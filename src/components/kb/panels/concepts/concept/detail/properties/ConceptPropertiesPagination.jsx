import { Box, Typography } from '@mui/material'

import ConceptPropertiesPageControls from './ConceptPropertiesPageControls'

const ConceptPropertiesPagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPrevious,
  onNext,
  onPageTextClick,
  disablePagination,
  hasItems,
}) => {
  if (disablePagination || !hasItems) {
    return null
  }

  const startIndex = (currentPage || 0) * (itemsPerPage || 1)
  const endIndex = startIndex + (itemsPerPage || 1)

  return (
    <Box
      className='clickable-element'
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mr: 2,
        cursor: 'default', // Ensure no pointer cursor on pagination area
      }}
      onClick={e => e.stopPropagation()} // Prevent accordion interference
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          gap: 1,
          justifyContent: 'flex-end',
        }}
      >
        <ConceptPropertiesPageControls
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          onPrevious={onPrevious}
          onNext={onNext}
        />
        <Typography
          className='clickable-element'
          variant='body2'
          sx={{
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            minWidth: '110px',
            textAlign: 'center',
          }}
          onClick={onPageTextClick}
        >
          {`${startIndex + 1}-${Math.min(endIndex, totalItems || 0)} of ${totalItems || 0}`}
        </Typography>
      </Box>
    </Box>
  )
}

export default ConceptPropertiesPagination
