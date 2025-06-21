import { Box, Typography, Stack } from '@mui/material'

const ITEMS_PER_PAGE = 5

const ConceptReferencesList = ({ references, currentPage }) => {
  const startIndex = currentPage * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentReferences = references?.slice(startIndex, endIndex) || []

  return (
    <Box>
      <Stack>
        {currentReferences.map((reference, index) => (
          <Typography
            key={reference.doi || index}
            variant='body1'
            sx={{
              pl: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            {reference.doi}
          </Typography>
        ))}
      </Stack>
    </Box>
  )
}

export default ConceptReferencesList
