import { Stack } from '@mui/material'
import { Box, TextField } from '@mui/material'
import ConceptSelect from '@/components/common/concept/ConceptSelect'
import ToConceptSelect from '@/components/common/concept/ToConceptSelect'

import useTemplateForm from '@/components/kb/panels/templates/form/useTemplateForm'

const TemplateForm = ({ isEdit = false, onChange, template }) => {
  const { handleChange } = useTemplateForm({ isEdit, onChange, template })

  const handleConceptSelect = (event, newValue) => {
    handleChange('concept')({ target: { value: newValue } })
  }

  const handleToConceptSelect = (event, newValue) => {
    handleChange('toConcept')({ target: { value: newValue } })
  }

  const handleToConceptSpecial = value => {
    // When a special value is selected, use it as the toConcept value
    // When null, use the current concept value
    handleChange('toConcept')({ target: { value: value === null ? '' : value } })
  }

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <ConceptSelect
        conceptName={template.concept}
        disabled={isEdit}
        handleConceptSelect={handleConceptSelect}
        navigation={false}
        required
      />
      <Box>
        <TextField
          fullWidth
          label='Link Name'
          onChange={handleChange('linkName')}
          required
          size='small'
          value={template.linkName}
        />
      </Box>
      <ToConceptSelect
        conceptName={template.toConcept}
        handleConceptSelect={handleToConceptSelect}
        onSpecialChange={handleToConceptSpecial}
      />
      <Box>
        <TextField
          fullWidth
          label='Link Value'
          value={template.linkValue}
          onChange={handleChange('linkValue')}
          size='small'
          required
        />
      </Box>
    </Stack>
  )
}

export default TemplateForm
