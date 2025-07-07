import { Box, FormControl, TextField, Divider } from '@mui/material'

import ToConceptSelect from '@/components/common/concept/ToConceptSelect'
import RealizationTemplatesFilter from './filter/RealizationTemplatesFilter'

export const EDIT_REALIZATION_FORM_ID = 'edit-realization-form'

const EditRealizationForm = ({
  formRealizationItem,
  handleChange,
  handleToConceptSelect,
  handleToConceptSpecial,
  stageChange,
}) => {
  return (
    <Box component='form' id={EDIT_REALIZATION_FORM_ID} onSubmit={stageChange}>
      <RealizationTemplatesFilter />
      <Divider sx={{ my: 2 }} />
      <FormControl fullWidth margin='normal'>
        <TextField
          label='Link Name'
          name='linkName'
          onChange={handleChange}
          required
          value={formRealizationItem.linkName}
        />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <ToConceptSelect
          conceptName={formRealizationItem.toConcept}
          doConceptSelected={handleToConceptSelect}
          onSpecialChange={handleToConceptSpecial}
        />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <TextField
          label='Link Value'
          name='linkValue'
          onChange={handleChange}
          required
          value={formRealizationItem.linkValue}
        />
      </FormControl>
    </Box>
  )
}

export default EditRealizationForm
