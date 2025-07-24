import { useMemo, useCallback } from 'react'
import { FormControl, Stack } from '@mui/material'

import TextInput from '@/components/common/TextInput'
import useAvailableLinkTemplates from '../useAvailableLinkTemplates'
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

  const isValidLinkName = useMemo(() => {
    const currentLinkName = realizationItem.linkName || ''
    return linkNameOptions.includes(currentLinkName)
  }, [linkNameOptions, realizationItem.linkName])

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
          required
          size='small'
          value={realizationItem.linkName || ''}
          InputProps={{ readOnly: true }}
          showClearButton={false}
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
          required
          size='small'
          value={realizationItem.linkValue}
        />
      </FormControl>
    </Stack>
  )
}

export default RealizationForm
