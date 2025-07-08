import { Box, Stack, Typography } from '@mui/material'

import PaginatedContainer from '@/components/common/PaginatedContainer'

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
}) => {
  const shouldShowItems = hasItems && !isLoading
  const shouldShowEmptyPlaceholder = !hasItems && !isLoading && fixedHeight !== undefined

  return (
    <Box>
      {isLoading && (
        <Typography variant='body2' sx={{ color: 'text.secondary', py: 1 }}>
          {loadingText}
        </Typography>
      )}
      {!isLoading && (
        <Box
          sx={{
            ml: 1.5,
            mt: 1,
            ...(fixedHeight !== undefined && { flex: 1 }),
          }}
        >
          <PaginatedContainer
            items={items}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            shouldShowItems={shouldShowItems}
          >
            {paginatedItems => (
              <Stack spacing={1}>
                {paginatedItems.map((item, index) => (
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
          </PaginatedContainer>
        </Box>
      )}
    </Box>
  )
}

export default ConceptPropertiesDetails
