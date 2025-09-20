import { use } from 'react'
import { Stack, Typography, Box } from '@mui/material'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_EXTENT } from '@/lib/constants'

const ConceptExportCsv = () => {
  const { modalData } = use(ConceptModalContext)
  const { conceptExtent } = modalData

  let message = 'Export the following fields '
  switch (conceptExtent) {
    case CONCEPT_EXTENT.CHILDREN:
      message += 'for the concept and its children:'
      break
    case CONCEPT_EXTENT.DESCENDANTS:
      message += 'for the concept and its descendants:'
      break
    default:
      message += 'for the concept:'
      break
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <Typography variant='body2' color='text.secondary'>
          {message}
        </Typography>
        <Box sx={{ pl: 2 }}>
          <Typography variant='body2'>• id</Typography>
          <Typography variant='body2'>• parentId</Typography>
          <Typography variant='body2'>• names (primary; aliases)</Typography>
        </Box>
      </Stack>
    </Box>
  )
}

export default ConceptExportCsv
