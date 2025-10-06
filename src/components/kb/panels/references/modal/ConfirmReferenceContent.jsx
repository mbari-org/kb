import { Stack, Typography } from '@mui/material'
import ConfirmReferenceChange from './ConfirmReferenceChange'

const ConfirmReferencesContent = ({ reference, original }) => {
  return (
    <Stack spacing={3} sx={{ minWidth: 500 }}>
      <Stack spacing={2} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <ConfirmReferenceChange
          label='Citation'
          oldValue={original.citation}
          newValue={reference.citation}
        />
        <ConfirmReferenceChange
          label='DOI'
          oldValue={original.doi}
          newValue={reference.doi}
        />
        <ConfirmReferenceChange
          label='Concepts'
          oldValue={original.concepts}
          newValue={reference.concepts}
          isArray={true}
        />
      </Stack>

      <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center', fontStyle: 'italic' }}>
        Click Confirm to save these changes, or Cancel to return to editing.
      </Typography>
    </Stack>
  )
}

export default ConfirmReferencesContent
