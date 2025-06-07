import { Stack } from '@mui/material'
import { Box, TextField } from '@mui/material'

import useTemplateForm from '@/components/kb/panels/templates/useTemplateForm'

const TemplateForm = ({ isEdit = false, onChange, template }) => {
  const { handleChange } = useTemplateForm({ isEdit, onChange, template })

  const fields = [
    { label: 'Concept', field: 'concept' },
    { label: 'Link Name', field: 'linkName' },
    { label: 'To Concept', field: 'toConcept' },
    { label: 'Link Value', field: 'linkValue' },
  ]

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      {fields.map(({ label, field }) => (
        <Box key={field}>
          <TextField
            fullWidth
            label={label}
            value={template[field]}
            onChange={handleChange(field)}
            size='small'
          />
        </Box>
      ))}
    </Stack>
  )
}

export default TemplateForm
