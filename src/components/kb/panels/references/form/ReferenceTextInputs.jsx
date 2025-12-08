import { use } from 'react'
import { Box, TextField } from '@mui/material'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import useDebouncedField from '@/lib/hooks/useDebouncedField'

const ReferenceTextInputs = ({ handleFieldChange, reference }) => {
  const { isDoiUnique } = use(PanelDataContext)

  const [doiValue, handleDoiChange] = useDebouncedField(reference.doi, 'doi', handleFieldChange)
  const [citationValue, handleCitationChange] = useDebouncedField(
    reference.citation,
    'citation',
    handleFieldChange
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        error={!isDoiUnique(doiValue, reference.id)}
        fullWidth
        helperText={!isDoiUnique(doiValue, reference.id) ? 'DOI already exists' : ''}
        label='DOI'
        onChange={handleDoiChange}
        required
        value={doiValue}
      />
      <TextField
        fullWidth
        label='Citation'
        maxRows={10}
        minRows={3}
        multiline
        onChange={handleCitationChange}
        required
        value={citationValue}
      />
    </Box>
  )
}

export default ReferenceTextInputs
