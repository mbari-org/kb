import { CONCEPT_STATE } from '@/lib/constants'
import { EMPTY_TEMPLATE } from '@/lib/kb/model/template'

import useDebounce from '@/hooks/useDebounce'

const useRealizationContentHandlers = ({
  realizationItem,
  setRealizationItem,
  modalData,
  setModalData,
  stagedState,
  action,
  realizationIndex,
  stageChange,
}) => {
  const debouncedInput = useDebounce((updatedRealizationItem, fieldIsModified, field) => {
    const updatedModified = { ...modalData.modified, [field]: fieldIsModified }

    setModalData(prev => ({
      ...prev,
      realizationItem: updatedRealizationItem,
      modified: updatedModified,
    }))
  })

  const handleRealizationChange = (updatedRealizationItem, field) => {
    setRealizationItem(updatedRealizationItem)

    const fieldIsModified =
      action === CONCEPT_STATE.REALIZATION.ADD
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

  return {
    handleRealizationChange,
    handleTemplateSelect,
  }
}

export default useRealizationContentHandlers
