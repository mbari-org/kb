import { Box } from '@mui/material'
import { usePaginationTransition } from '@/hooks/usePaginationTransition'
import '@/hooks/paginationTransition.css'

/**
 * A reusable container component that handles pagination transitions and gradient overlays
 */
const PaginatedContainer = ({
  items,
  currentPage,
  itemsPerPage,
  shouldShowItems = true,
  children,
  ...boxProps
}) => {
  const { paginatedItems, hasMoreItems, hasPreviousItems, getTransitionStyles } =
    usePaginationTransition(currentPage, itemsPerPage, items)

  return (
    <Box
      className={`pagination-container ${
        shouldShowItems && hasPreviousItems ? 'has-previous' : ''
      } ${shouldShowItems && hasMoreItems ? 'has-more' : ''}`}
      sx={{
        '--paper-color': theme => theme.palette.background.paper,
      }}
      {...boxProps}
    >
      {shouldShowItems && (
        <Box sx={getTransitionStyles()}>
          {typeof children === 'function' ? children(paginatedItems) : children}
        </Box>
      )}
      {!shouldShowItems && children}
    </Box>
  )
}

export default PaginatedContainer
