import { Box, Typography } from '@mui/material'

import ConceptPropertiesEmpty from './ConceptPropertiesEmpty'
import ConceptPropertiesPagination from './ConceptPropertiesPagination'

const ConceptPropertiesCount = ({
  currentPage,
  disablePagination,
  hasItems,
  itemsPerPage,
  onPageChange,
  onPageTextClick,
  showEmptyIcon,
  totalItems,
}) => {
  return (
    <>
      {!disablePagination && hasItems && (
        <ConceptPropertiesPagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPrevious={() => onPageChange((currentPage || 0) - 1)}
          onNext={() => onPageChange((currentPage || 0) + 1)}
          onPageTextClick={onPageTextClick}
          disablePagination={disablePagination}
          hasItems={hasItems}
        />
      )}
      {disablePagination && hasItems && (
        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant='body2' color='text.secondary'>
            {totalItems}
          </Typography>
        </Box>
      )}
      {showEmptyIcon && (
        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
          <ConceptPropertiesEmpty />
        </Box>
      )}
    </>
  )
}

export default ConceptPropertiesCount
