import { Box, Stack, Typography } from '@mui/material'

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
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = items.slice(startIndex, endIndex)
  
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
        <Box sx={{ ml: 1.5, mt: 1, ...(fixedHeight !== undefined && { flex: 1 }) }}>
          <Stack spacing={1}>
            {shouldShowItems && (
              paginatedItems.map((item, index) => (
                <Box key={renderItem.key ? renderItem.key(item, index) : index}>
                  {renderComponent
                    ? renderComponent(item, index)
                    : typeof renderItem.content === 'function'
                    ? renderItem.content(item, index)
                    : renderItem.content}
                </Box>
              ))
            )}
            {shouldShowEmptyPlaceholder && (
              <Box sx={{ height: 0 }}>
                {/* Empty placeholder when fixedHeight is set */}
              </Box>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default ConceptPropertiesDetails
