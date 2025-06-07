import { Stack } from '@mui/material'
import { Box, TextField } from '@mui/material'
import ConceptSelect from '@/components/common/ConceptSelect'
import ToConceptSpecial from './ToConceptSpecial'

import useTemplateForm from '@/components/kb/panels/templates/useTemplateForm'

const TemplateForm = ({ isEdit = false, onChange, template }) => {
  const { handleChange, isSpecialValue } = useTemplateForm({ isEdit, onChange, template })

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
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', right: 0, top: 0, zIndex: 1 }}>
          <ToConceptSpecial
            value={isSpecialValue ? template.toConcept : ''}
            onChange={handleToConceptSpecial}
          />
        </Box>
        <ConceptSelect
          conceptName={isSpecialValue ? '' : template.toConcept}
          disabled={isSpecialValue}
          handleConceptSelect={handleToConceptSelect}
          label='To Concept'
          navigation={false}
          required
        />
      </Box>
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
