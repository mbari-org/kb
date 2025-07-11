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

  const {
    handleLinkNameSelect,
    handleLinkNameInputChange,
    handleLinkValueChange,
    handleKeyDown,
    handleLinkValueKeyDown,
  } = useRealizationFormHandlers({
    allAvailableTemplates,
    filteredOptions,
    focusLinkValue: () => {
      const linkValueInput = document.querySelector('input[name="linkValue"]')
      linkValueInput?.focus()
    },
    onRealizationChange,
    realizationItem,
  })

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
        <Autocomplete
          onChange={handleLinkNameSelect}
          onInputChange={handleLinkNameInputChange}
          options={linkNameOptions}
          renderInput={params => (
            <TextField
              {...params}
              label='Link Name'
              onKeyDown={handleKeyDown}
              required
              size='small'
            />
          )}
          size='small'
          value={realizationItem.linkName || ''}
        />
      </FormControl>
      <RealizationToConcept
        isValidLinkName={isValidLinkName}
        onRealizationChange={onRealizationChange}
        realizationItem={realizationItem}
      />
      <FormControl fullWidth margin='normal'>
        <TextInput
          disabled={!isValidLinkName}
          label='Link Value'
          name='linkValue'
          onChange={handleLinkValueChange}
          onKeyDown={handleKeyDown}
          required
          size='small'
          value={realizationItem.linkValue}
        />
      </FormControl>
    </Stack>
  )
}

export default RealizationForm
