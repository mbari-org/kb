import { Box, TextField } from '@mui/material'

const ReferenceForm = ({ reference, onChange, isDoiUnique, isEdit = false }) => {
  const handleChange = field => event => {
    const newValue = event.target.value
    const updatedReference = {
      ...reference,
      [field]: newValue,
    }

    if (isEdit) {
      const modified =
        field === 'citation'
          ? newValue !== reference.originalReference.citation
          : field === 'doi'
          ? newValue !== reference.originalReference.doi
          : false

      onChange(updatedReference, modified)
    } else {
      onChange(updatedReference)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
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
      <TextField
        error={!isDoiUnique(reference.doi, reference.id)}
        fullWidth
        helperText={!isDoiUnique(reference.doi, reference.id) ? 'DOI already exists' : ''}
        label='DOI'
        onChange={handleChange('doi')}
        required
        value={reference.doi || ''}
      />
    </Box>
  )
}

export default ReferenceForm
