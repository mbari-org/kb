import { Stack } from '@mui/material'
import { Box, TextField } from '@mui/material'
import ToConceptSelect from '@/components/common/concept/ToConceptSelect'
import ModalActionText from '@/components/common/ModalActionText'
import ActionsAlert from '@/components/modal/actions/ActionsAlert'

import useTemplateForm from '@/components/kb/panels/templates/form/useTemplateForm'

const TemplateForm = ({ alert = null, isEdit = false, onChange, original, template }) => {
  const { handleChange } = useTemplateForm({ isEdit, onChange, template, original })

  const handleToConceptSelect = newValue => {
    handleChange('toConcept')({ target: { value: newValue } })
  }

  const handleToConceptSpecial = value => {
    // When a special value is selected, use it as the toConcept value
    handleChange('toConcept')({ target: { value: value === null ? '' : value } })
  }

  return (
    <Stack spacing={2}>
      <ModalActionText text={`${isEdit ? 'Edit' : 'Add'} Template`} />
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
        doConceptSelected={handleToConceptSelect}
        onSpecialChange={handleToConceptSpecial}
        width='100%'
      />
      <Box>
        <TextField
          fullWidth
          label='Link Value'
          onChange={handleChange('linkValue')}
          required
          size='small'
          value={template.linkValue}
        />
      </Box>
      <Stack
        spacing={0}
        sx={{ alignItems: 'center', mt: 1, minHeight: 68, justifyContent: 'center' }}
      >
        {alert && (
          <ActionsAlert line1={alert.line1} line2={alert.line2} severity={alert.severity} />
        )}
      </Stack>
    </Stack>
  )
}

export default TemplateForm
