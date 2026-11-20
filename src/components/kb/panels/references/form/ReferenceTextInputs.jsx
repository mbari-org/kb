import { use } from 'react'
import { Box, TextField } from '@mui/material'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import useDebouncedField from '@/lib/hooks/useDebouncedField'

import CONFIG from '@/lib/config'

const { LABEL, VALIDATION } = CONFIG.PANELS.REFERENCES.FORM

const ReferenceTextInputs = ({ handleFieldChange, reference }) => {
  const { isDoiUnique } = use(PanelDataContext)

  const [doiValue, handleDoiChange] = useDebouncedField(reference.doi, 'doi', handleFieldChange)
  const [citationValue, handleCitationChange] = useDebouncedField(reference.citation, 'citation', handleFieldChange)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        error={!isDoiUnique(doiValue, reference.id)}
        fullWidth
        helperText={!isDoiUnique(doiValue, reference.id) ? VALIDATION.DOI_EXISTS : ''}
        label={LABEL.DOI}
        onChange={handleDoiChange}
        required
        value={doiValue}
      />

      <TextField
        fullWidth
        label={LABEL.CITATION}
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
