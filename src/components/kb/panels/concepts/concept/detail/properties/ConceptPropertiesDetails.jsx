import { Box, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'

import '@/hooks/paginationTransition.css'

const ConceptPropertiesDetails = ({
  fixedHeight,
  isLoading,
  loadingText,
  hasItems,
  items,
  currentPage,
  itemsPerPage,
  renderComponent,
  renderItem,
  animationDirection = 'up',
}) => {
  const shouldShowItems = hasItems && !isLoading
  const shouldShowEmptyPlaceholder = !hasItems && !isLoading && fixedHeight !== undefined

  const hasMoreItems = items && items.length > (currentPage + 1) * itemsPerPage
  const hasPreviousItems = currentPage > 0

  return (
    <Box>
      {isLoading && (
        <Typography variant='body2' sx={{ color: 'text.secondary', py: 1 }}>
          {loadingText}
        </Typography>
      )}
      {!isLoading && (
        <motion.div
          key={currentPage}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              type: 'tween',
              duration: 0.3,
              ease: 'easeOut',
            },
          }}
          initial={{
            y: animationDirection === 'up' ? 30 : -30,
            opacity: 0,
          }}
        >
          <Box
            className={`pagination-container ${
              shouldShowItems && hasPreviousItems ? 'has-previous' : ''
            } ${shouldShowItems && hasMoreItems ? 'has-more' : ''}`}
            sx={{
              ml: 1.5,
              mt: 1,
              '--paper-color': theme => theme.palette.background.paper,
              ...(fixedHeight !== undefined && { flex: 1 }),
            }}
          >
            {shouldShowItems && (
              <Stack spacing={1}>
                {items
                  .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                  .map((item, index) => (
                    <Box key={renderItem.key ? renderItem.key(item, index) : index} sx={{ mb: 1 }}>
                      {renderComponent
                        ? renderComponent(item, index)
                        : typeof renderItem.content === 'function'
                        ? renderItem.content(item, index)
                        : renderItem.content}
                    </Box>
                  ))}
                {shouldShowEmptyPlaceholder && (
                  <Box sx={{ height: 0 }}>{/* Empty placeholder when fixedHeight is set */}</Box>
                )}
              </Stack>
            )}
          </Box>
        </motion.div>
      )}
    </Box>
  )
}

export default ConceptPropertiesDetails
