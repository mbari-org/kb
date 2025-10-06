import { Box, Stack } from '@mui/material'

import ConfirmReferenceField from './ConfirmReferenceField'
import ConfirmReferenceConcepts from './ConfirmReferenceConcepts'

const ConfirmReferencesContent = ({ reference, original }) => {
  return (
    <Stack direction='column' spacing={1}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <ConfirmReferenceField
          field='citation'
          originalValue={original.citation}
          updatedValue={reference.citation}
        />
        <ConfirmReferenceField
          field='doi'
          originalValue={original.doi}
          updatedValue={reference.doi}
        />
        <ConfirmReferenceConcepts
          originalConcepts={original.concepts}
          updatedConcepts={reference.concepts}
        />
      </Box>
    </Stack>
  )
}

export default ConfirmReferencesContent
