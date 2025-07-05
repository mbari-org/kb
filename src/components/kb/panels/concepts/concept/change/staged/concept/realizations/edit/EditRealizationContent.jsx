import { use, useCallback, useEffect, useState } from 'react'
import { Box, FormControl, TextField } from '@mui/material'

import ToConceptSelect from '@/components/common/concept/ToConceptSelect'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import useStageRealization from './useStageRealization'
import useDebounce from '@/hooks/useDebounce'

import { CONCEPT_STATE } from '@/lib/constants'
import { EMPTY_REALIZATION_ITEM } from './realizationItem'

export const EDIT_REALIZATION_FORM_ID = 'edit-realization-form'

const EditRealizationContent = () => {
  const { concept, stagedState } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)

  const { action, realizationIndex, realizationItem } = modalData

  const [formRealizationItem, setFormRealizationItem] = useState(realizationItem)

  const [modifiedFields, setModifiedFields] = useState({
    linkName: false,
    toConcept: false,
    linkValue: false,
  })

  // Debounced function to update form state and modal data
  const debouncedUpdateForm = useDebounce((updatedRealizationItem, fieldIsModified, field) => {
    const updatedModifiedFields = { ...modifiedFields, [field]: fieldIsModified }
    setModifiedFields(updatedModifiedFields)

    const modified = Object.values(updatedModifiedFields).some(fieldIsModified => fieldIsModified)

    setModalData(prev => ({ ...prev, realizationItem: updatedRealizationItem, modified }))
  }, 300)

  const handleChange = event => {
    const { name: field, value } = event.target

    const updatedRealizationItem = {
      ...formRealizationItem,
      [field]: value,
    }

    // Update form state immediately for responsive UI
    setFormRealizationItem(updatedRealizationItem)

    const fieldIsModified =
      action === CONCEPT_STATE.REALIZATION.ADD
        ? updatedRealizationItem[field] !== EMPTY_REALIZATION_ITEM[field]
        : stagedState.realizations[realizationIndex][field] !== updatedRealizationItem[field]

    // Debounce the form state update and modal data changes
    debouncedUpdateForm(updatedRealizationItem, fieldIsModified, field)
  }

  const handleToConceptSelect = newValue => {
    const updatedRealizationItem = {
      ...formRealizationItem,
      toConcept: newValue,
    }

    setFormRealizationItem(updatedRealizationItem)

    const fieldIsModified =
      action === CONCEPT_STATE.REALIZATION.ADD
        ? updatedRealizationItem.toConcept !== EMPTY_REALIZATION_ITEM.toConcept
        : stagedState.realizations[realizationIndex].toConcept !== updatedRealizationItem.toConcept

    debouncedUpdateForm(updatedRealizationItem, fieldIsModified, 'toConcept')
  }

  const handleToConceptSpecial = value => {
    // When a special value is selected, use it as the toConcept value
    const updatedRealizationItem = {
      ...formRealizationItem,
      toConcept: value === null ? '' : value,
    }

    setFormRealizationItem(updatedRealizationItem)

    const fieldIsModified =
      action === CONCEPT_STATE.REALIZATION.ADD
        ? updatedRealizationItem.toConcept !== EMPTY_REALIZATION_ITEM.toConcept
        : stagedState.realizations[realizationIndex].toConcept !== updatedRealizationItem.toConcept

    debouncedUpdateForm(updatedRealizationItem, fieldIsModified, 'toConcept')
  }

  const stageRealization = useStageRealization()
  const stageChange = event => {
    stageRealization(event)
  }

  if (!realizationItem) {
    return null
  }

  return (
    <Box component='form' id={EDIT_REALIZATION_FORM_ID} onSubmit={stageChange}>
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

export default EditRealizationContent
