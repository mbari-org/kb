import { Box, TextField } from '@mui/material'

const ReferenceTextInputs = ({ isDoiUnique, reference, handleChange }) => {
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
