import { Box, FormControl, Stack } from '@mui/material'

import TextInput from '@/components/common/TextInput'
import ToConceptSelect from '@/components/common/concept/ToConceptSelect'

export const EDIT_REALIZATION_FORM_ID = 'edit-realization-form'

const RealizationForm = ({
  formRealizationItem,
  handleChange,
  handleToConceptSelect,
  handleToConceptSpecial,
  stageChange,
}) => {
  return (
    <Box component='form' id={EDIT_REALIZATION_FORM_ID} onSubmit={stageChange}>
      <Stack direction='row' spacing={1} width='100%' alignItems='center'>
        <Box sx={{ width: 200, flexShrink: 0, pt: 4.5 }}>
          <FormControl fullWidth margin='normal' sx={{ mt: 0 }}>
            <TextInput
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
      <Box sx={{ width: '100%' }}>
        <FormControl fullWidth margin='normal'>
          <TextInput
            label='Link Value'
            name='linkValue'
            onChange={handleChange}
            required
            size='small'
            value={formRealizationItem.linkValue}
          />
        </FormControl>
      </Box>
    </Box>
  )
}

export default RealizationForm
