import { useMemo, useCallback, useState } from 'react'
import { FormControl, Stack } from '@mui/material'

import TextInput from '@/components/common/TextInput'
import useAvailableLinkTemplates from '../useAvailableLinkTemplates'
import RealizationToConcept from './RealizationToConcept'

export const EDIT_REALIZATION_FORM_ID = 'edit-realization-form'

const RealizationForm = ({
  onRealizationChange,
  realizationItem,
  stageChange,
  isEditMode = false,
  onValidationChange,
}) => {
  const getAvailableLinkTemplates = useAvailableLinkTemplates()

  const [isValidToConcept, setIsValidToConcept] = useState(true)

  const allAvailableTemplates = useMemo(() => {
    return getAvailableLinkTemplates()
  }, [getAvailableLinkTemplates])

  const linkNameOptions = useMemo(() => {
    const uniqueLinkNames = [...new Set(allAvailableTemplates.map(template => template.linkName))]
    return uniqueLinkNames.sort()
  }, [allAvailableTemplates])

  const isValidLinkName = useMemo(() => {
    const currentLinkName = realizationItem.linkName || ''
    return linkNameOptions.includes(currentLinkName)
  }, [linkNameOptions, realizationItem.linkName])

  const handleToConceptValidationChange = useCallback((isValid) => {
    setIsValidToConcept(isValid)
    if (onValidationChange) {
      onValidationChange({ isValidToConcept: isValid })
    }
  }, [onValidationChange])

  // Handler for link value (linkName is now read-only)
  const handleLinkValueChange = useCallback(
    event => {
      const { name: field, value } = event.target
      const updatedRealizationItem = {
        ...realizationItem,
        [field]: value,
      }
      onRealizationChange(updatedRealizationItem, field)
    },
    [realizationItem, onRealizationChange]
  )

  return (
    <Stack
      component='form'
      direction='column'
      id={EDIT_REALIZATION_FORM_ID}
      onSubmit={stageChange}
      spacing={2}
      sx={{ mt: 2.5 }}
      width='100%'
    >
      <FormControl fullWidth margin='normal'>
        <TextInput
          label='Link Name'
          name='linkName'
          size='small'
          value={realizationItem.linkName || ''}
          disabled
          showClearButton={false}
          sx={{
            '& .MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
              color: 'rgba(0, 0, 0, 0.87)',
            },
            '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
            '& .MuiInputLabel-root.Mui-disabled': {
              color: 'rgba(0, 0, 0, 0.6)',
            },
          }}
        />
      </FormControl>
      <RealizationToConcept
        isValidLinkName={isValidLinkName}
        onRealizationChange={onRealizationChange}
        realizationItem={realizationItem}
        isEditMode={isEditMode}
        onValidationChange={handleToConceptValidationChange}
      />
      <FormControl fullWidth margin='normal'>
        <TextInput
          disabled={!isValidLinkName}
          label='Link Value'
          name='linkValue'
          onChange={handleLinkValueChange}
          required
          size='small'
          value={realizationItem.linkValue}
        />
      </FormControl>
    </Stack>
  )
}

export default RealizationForm
