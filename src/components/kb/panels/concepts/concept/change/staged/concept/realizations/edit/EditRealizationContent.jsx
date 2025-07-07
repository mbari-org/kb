import { use, useState } from 'react'
import { Box, Divider } from '@mui/material'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import useStageRealization from './useStageRealization'
import useDebounce from '@/hooks/useDebounce'
import RealizationForm from './RealizationForm'
import RealizationTemplatesFilter from './filter/RealizationTemplatesFilter'

import { CONCEPT_STATE } from '@/lib/constants'
import { EMPTY_REALIZATION_ITEM } from './realizationItem'

const EditRealizationContent = () => {
  const { stagedState } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)

  const { action, realizationIndex, realizationItem } = modalData

  const [formRealizationItem, setFormRealizationItem] = useState(realizationItem)

  const debouncedUpdateForm = useDebounce((updatedRealizationItem, fieldIsModified, field) => {
    const updatedModified = { ...modalData.modified, [field]: fieldIsModified }

    setModalData(prev => ({ ...prev, realizationItem: updatedRealizationItem, modified: updatedModified }))
  }, 300)

  const handleChange = event => {
    const { name: field, value } = event.target

    const updatedRealizationItem = {
      ...formRealizationItem,
      [field]: value,
    }

    setFormRealizationItem(updatedRealizationItem)

    const fieldIsModified =
      action === CONCEPT_STATE.REALIZATION.ADD
        ? updatedRealizationItem[field] !== EMPTY_REALIZATION_ITEM[field]
        : stagedState.realizations[realizationIndex][field] !== updatedRealizationItem[field]

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
    <Box>
      <RealizationTemplatesFilter onTemplateSelect={handleChange} />
      <Divider sx={{ my: 2 }} />
      <RealizationForm
        formRealizationItem={formRealizationItem}
        handleChange={handleChange}
        handleToConceptSelect={handleToConceptSelect}
        handleToConceptSpecial={handleToConceptSpecial}
        stageChange={stageChange}
      />
    </Box>
  )
}

export default EditRealizationContent
