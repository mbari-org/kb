import { useMemo } from 'react'
import { FormControl, Stack, Autocomplete, TextField } from '@mui/material'

import TextInput from '@/components/common/TextInput'
import useAvailableLinkTemplates from '../useAvailableLinkTemplates'
import useRealizationFormHandlers from './useRealizationFormHandlers'
import RealizationToConcept from './RealizationToConcept'

export const EDIT_REALIZATION_FORM_ID = 'edit-realization-form'

const RealizationForm = ({ onRealizationChange, realizationItem, stageChange }) => {
  const getAvailableLinkTemplates = useAvailableLinkTemplates()

  const allAvailableTemplates = useMemo(() => {
    return getAvailableLinkTemplates()
  }, [getAvailableLinkTemplates])

  const linkNameOptions = useMemo(() => {
    const uniqueLinkNames = [...new Set(allAvailableTemplates.map(template => template.linkName))]
    return uniqueLinkNames.sort()
  }, [allAvailableTemplates])

  const filteredOptions = useMemo(() => {
    const currentInput = realizationItem.linkName || ''
    if (!currentInput) return linkNameOptions
    return linkNameOptions.filter(option =>
      option.toLowerCase().includes(currentInput.toLowerCase())
    )
  }, [linkNameOptions, realizationItem.linkName])

  const isValidLinkName = useMemo(() => {
    const currentLinkName = realizationItem.linkName || ''
    return linkNameOptions.includes(currentLinkName)
  }, [linkNameOptions, realizationItem.linkName])

  const { handleLinkNameSelect, handleLinkNameInputChange, handleLinkValueChange, handleKeyDown } =
    useRealizationFormHandlers({
      realizationItem,
      onRealizationChange,
      allAvailableTemplates,
      filteredOptions,
      focusLinkValue: () => {
        const linkValueInput = document.querySelector('input[name="linkValue"]')
        linkValueInput?.focus()
      },
    })

  return (
    <Stack
      component='form'
      id={EDIT_REALIZATION_FORM_ID}
      onSubmit={stageChange}
      direction='column'
      spacing={2}
      sx={{ mt: 2.5 }}
      width='100%'
    >
      <FormControl fullWidth margin='normal'>
        <Autocomplete
          options={linkNameOptions}
          value={realizationItem.linkName || ''}
          onChange={handleLinkNameSelect}
          onInputChange={handleLinkNameInputChange}
          size='small'
          renderInput={params => (
            <TextField
              {...params}
              label='Link Name'
              required
              size='small'
              onKeyDown={handleKeyDown}
            />
          )}
        />
      </FormControl>
      <RealizationToConcept
        realizationItem={realizationItem}
        onRealizationChange={onRealizationChange}
        isValidLinkName={isValidLinkName}
      />
      <FormControl fullWidth margin='normal'>
        <TextInput
          label='Link Value'
          name='linkValue'
          onChange={handleLinkValueChange}
          required
          size='small'
          value={realizationItem.linkValue}
          disabled={!isValidLinkName}
        />
      </FormControl>
    </Stack>
  )
}

export default RealizationForm
