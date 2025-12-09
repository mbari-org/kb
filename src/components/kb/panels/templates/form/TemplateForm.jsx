import { Box, Stack, TextField } from '@mui/material'
import ToConceptSelect from '@/components/common/concept/ToConceptSelect'
import ModalActionText from '@/components/common/ModalActionText'
import DiscardingAlert from '@/components/modal/actions/DiscardingAlert'

import { CONFIG } from '@/config/js/index.js'
import useTemplateForm from '@/components/kb/panels/templates/form/useTemplateForm'

const { ADD, EDIT } = CONFIG.PANELS.TEMPLATES.MODALS

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
      <ModalActionText text={isEdit ? EDIT.CONTENT.HEADER : ADD.CONTENT.HEADER} />
      <TextField
          fullWidth
          label='Link Name'
          onChange={handleChange('linkName')}
          required
          size='small'
          value={template.linkName}
        />
      <ToConceptSelect
        conceptName={template.toConcept}
        doConceptSelected={handleToConceptSelect}
        onSpecialChange={handleToConceptSpecial}
        width='100%'
      />
      <TextField
          fullWidth
          label='Link Value'
          onChange={handleChange('linkValue')}
          required
          size='small'
          value={template.linkValue}
        />
      <Box sx={{ alignItems: 'center', display: 'flex', height: 60, justifyContent: 'center', pt: alert ? 0.5 : 0 }}>
        {alert ? <DiscardingAlert /> : null}
      </Box>
    </Stack>
  )
}

export default TemplateForm
