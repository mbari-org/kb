import { Box, Stack, Typography } from '@mui/material'

const ConceptPropertiesDetails = ({
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
  return (
    <>
      {isLoading && (
        <Typography variant='body2' sx={{ color: 'text.secondary', py: 1 }}>
          {loadingText}
        </Typography>
      )}
      {hasItems && !isLoading && (
        <Box sx={{ ml: 1.5, mt: 1 }}>
          <Stack spacing={1}>
            {paginatedItems.map((item, index) => (
              <Box key={renderItem.key ? renderItem.key(item, index) : index}>
                {renderComponent
                  ? renderComponent(item, index)
                  : typeof renderItem.content === 'function'
                  ? renderItem.content(item, index)
                  : renderItem.content}
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </>
  )
}

export default ConceptPropertiesDetails
