import { Box, Typography, Stack } from '@mui/material'

import { CONCEPT_PROPERTY_LIST } from '@/lib/constants'

const { ITEMS_PER_PAGE } = CONCEPT_PROPERTY_LIST

const ConceptPropertiesList = ({ items, currentPage, renderItem }) => {
  const startIndex = currentPage * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = items?.slice(startIndex, endIndex) || []
  const hasMoreItems = items && items.length > endIndex
  const hasPreviousItems = currentPage > 0

  return (
    <Box>
      <Stack>
        {hasPreviousItems && (
          <Typography
            variant='body1'
            sx={{
              mt: -1.5,
              ml: 5,
              color: 'text.secondary',
              fontStyle: 'italic',
              fontWeight: 'bold',
            }}
          >
            ...
          </Typography>
        )}
        {currentItems.map((item, index) => (
          <Typography
            key={renderItem.key ? renderItem.key(item, index) : index}
            variant='body1'
            sx={{
              pl: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            {renderItem.content(item, index)}
          </Typography>
        ))}
        {hasMoreItems && (
          <Typography
            variant='body1'
            sx={{
              mt: -1.5,
              ml: 5,
              color: 'text.secondary',
              fontStyle: 'italic',
              fontWeight: 'bold',
            }}
          >
            ...
          </Typography>
        )}
      </Stack>
    </Box>
  )
}

export default ConceptPropertiesList
