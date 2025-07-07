import { Box, Typography } from '@mui/material'

import ConceptPropertiesCount from './ConceptPropertiesCount'
import ConceptPropertiesDisclosure from './ConceptPropertiesDisclosure'

const ConceptPropertiesSummary = ({
  children,
  expanded,
  fixedHeight,
  handleToggle,
  IconComponent,
  showEmptyIcon,
  title,
  // ConceptPropertiesCount props
  currentPage,
  disablePagination,
  hasItems,
  itemsPerPage,
  onPageChange,
  onPageTextClick,
  totalItems,
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
      <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      {IconComponent && (
        <Box
          className='clickable-element'
          sx={{
            alignItems: 'center',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            ml: -0.5,
            mt: -1,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <IconComponent />
        </Box>
      )}
      <Box sx={{ ml: 2, flex: 1 }}>{children}</Box>
      <ConceptPropertiesCount
        currentPage={currentPage}
        disablePagination={disablePagination}
        hasItems={hasItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        onPageTextClick={onPageTextClick}
        showEmptyIcon={showEmptyIcon}
        totalItems={totalItems}
      />
      {!showEmptyIcon && fixedHeight === undefined && (
        <ConceptPropertiesDisclosure expanded={expanded} onToggle={handleToggle} />
      )}
    </Box>
  )
}

export default ConceptPropertiesSummary
