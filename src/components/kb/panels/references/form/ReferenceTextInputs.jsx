import { use } from 'react'
import { Box, TextField } from '@mui/material'

import ReferencesContext from '@/contexts/references/ReferencesContext'

const ReferenceTextInputs = ({ reference, handleChange }) => {
  const { isDoiUnique } = use(ReferencesContext)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        error={!isDoiUnique(reference.doi, reference.id)}
        fullWidth
        helperText={!isDoiUnique(reference.doi, reference.id) ? 'DOI already exists' : ''}
        label='DOI'
        onChange={handleChange('doi')}
        required
        value={reference.doi || ''}
      />
      <TextField
        fullWidth
        label='Citation'
        maxRows={10}
        minRows={3}
        multiline
        onChange={handleChange('citation')}
        required
        value={reference.citation || ''}
      />
    </Box>
  )
}

export default ReferenceTextInputs
