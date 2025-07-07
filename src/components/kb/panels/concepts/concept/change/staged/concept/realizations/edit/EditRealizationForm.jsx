import { Box, FormControl, TextField, Divider, Stack } from '@mui/material'

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
      <Stack direction='row' spacing={1} width='100%' alignItems='center'>
        <Box sx={{ width: 200, flexShrink: 0, pt: 2.5 }}>
          <FormControl fullWidth margin='normal'>
            <TextField
              label='Link Name'
              name='linkName'
              onChange={handleChange}
              required
              size='small'
              value={formRealizationItem.linkName}
            />
          </FormControl>
        </Box>
        <Box sx={{ flex: 1 }}>
          <FormControl fullWidth margin='normal'>
            <ToConceptSelect
              conceptName={formRealizationItem.toConcept}
              doConceptSelected={handleToConceptSelect}
              onSpecialChange={handleToConceptSpecial}
            />
          </FormControl>
        </Box>
      </Stack>
      <FormControl fullWidth margin='normal'>
        <TextField
          label='Link Value'
          name='linkValue'
          onChange={handleChange}
          required
          size='small'
          value={formRealizationItem.linkValue}
        />
      </FormControl>
    </Box>
  )
}

export default EditRealizationForm
