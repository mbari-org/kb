import { use, useState, useMemo } from 'react'
import { Box, Divider } from '@mui/material'

import RealizationForm from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/form/RealizationForm'
import RealizationTemplatesFilter from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/filter/RealizationTemplatesFilter'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import PanelDataContext from '@/contexts/panelData/PanelDataContext'

import { EMPTY_TEMPLATE } from '@/lib/kb/model/template'
import { isSame } from '@/lib/kb/model/realization'

import useStageRealization from './useStageRealization'

import useDebounce from '@/hooks/useDebounce'

import { CONCEPT_STATE } from '@/lib/constants'

const RealizationContent = () => {
  const { stagedState } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)
  const { isLoading } = use(PanelDataContext)

  const { action, realizationIndex, modalRealizationItem } = modalData

  const [realizationItem, setRealizationItem] = useState(modalRealizationItem || EMPTY_TEMPLATE)

  const isDuplicate = useMemo(() => {
    // Don't check for duplicates if form is incomplete
    if (!realizationItem.linkName || !realizationItem.toConcept || !realizationItem.linkValue) {
      return false
    }

    // For editing existing realizations, exclude the current realization from the check
    const realizationsToCheck =
      action === CONCEPT_STATE.REALIZATION_ITEM.ADD
        ? stagedState.realizations
        : stagedState.realizations.filter((_, index) => index !== realizationIndex)

    return realizationsToCheck.some(existing => isSame(realizationItem, existing))
  }, [realizationItem, stagedState.realizations, action, realizationIndex])

  // Update modal context with duplicate state
  useMemo(() => {
    setModalData(prev => ({
      ...prev,
      isDuplicate,
    }))
  }, [isDuplicate, setModalData])

  const debouncedInput = useDebounce((updatedRealizationItem, fieldIsModified, field) => {
    const updatedModified = { ...modalData.modified, [field]: fieldIsModified }

    setModalData(prev => ({
      ...prev,
      realizationItem: updatedRealizationItem,
      modified: updatedModified,
    }))
  }, 300)

  const handleRealizationChange = (updatedRealizationItem, field) => {
    setRealizationItem(updatedRealizationItem)

    const fieldIsModified =
      action === CONCEPT_STATE.REALIZATION_ITEM.ADD
        ? updatedRealizationItem[field] !== EMPTY_TEMPLATE[field]
        : stagedState.realizations[realizationIndex][field] !== updatedRealizationItem[field]

    debouncedInput(updatedRealizationItem, fieldIsModified, field)
  }

  const handleTemplateSelect = template => {
    // Auto-populate all fields from the selected template
    const updatedRealizationItem = {
      ...realizationItem,
      linkName: template.linkName,
      toConcept: template.toConcept,
      linkValue: template.linkValue,
      templateId: template.id, // Store the template ID for reference
    }

    setRealizationItem(updatedRealizationItem)

    // Mark all populated fields as modified
    const updatedModified = {
      ...modalData.modified,
      linkName: true,
      toConcept: true,
      linkValue: true,
    }

    setModalData(prev => ({
      ...prev,
      realizationItem: updatedRealizationItem,
      modified: updatedModified,
    }))
  }

  const stageRealization = useStageRealization()
  const stageChange = event => {
    if (isDuplicate) {
      event.preventDefault()
      return
    }
    stageRealization(event)
  }

  if (!realizationItem) {
    return null
  }

  return (
    <Box>
      <RealizationTemplatesFilter
        isLoading={isLoading}
        linkName={realizationItem.linkName}
        onTemplateSelect={handleTemplateSelect}
      />
      <Divider sx={{ my: 1 }} />
      <RealizationForm
        realizationItem={realizationItem}
        onRealizationChange={handleRealizationChange}
        stageChange={stageChange}
      />
    </Box>
  )
}

export default RealizationContent
