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
  const { paginatedItems } = usePaginationTransition(currentPage, itemsPerPage, items)

  const hasMoreItems = items && items.length > (currentPage + 1) * itemsPerPage
  const hasPreviousItems = currentPage > 0

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
        <Box>
          {typeof children === 'function' ? children(paginatedItems) : children}
        </Box>
      )}
      {!shouldShowItems && (
        typeof children === 'function' ? children([]) : children
      )}
    </Box>
  )
}

export default PaginatedContainer
