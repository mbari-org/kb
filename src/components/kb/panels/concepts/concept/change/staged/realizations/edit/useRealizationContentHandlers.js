import { CONCEPT_STATE } from '@/lib/constants'
import { EMPTY_TEMPLATE } from '@/lib/kb/model/template'

import useDebounce from '@/hooks/useDebounce'

const useRealizationContentHandlers = ({
  action,
  modalData,
  realizationIndex,
  realizationItem,
  setModalData,
  setRealizationItem,
  stagedState,
}) => {
  const debouncedInput = useDebounce((updatedRealizationItem, fieldIsModified, field) => {
    const updatedModified = { ...modalData.modified, [field]: fieldIsModified }

    setModalData(prev => ({
      ...prev,
      realizationItem: updatedRealizationItem,
      modified: updatedModified,
    }))
  })

  const handleRealizationChange = updatedRealizationItem => {
    setRealizationItem(updatedRealizationItem)
    const field = 'linkName'

    const fieldIsModified =
      action === CONCEPT_STATE.REALIZATION.ADD
        ? updatedRealizationItem[field] !== EMPTY_TEMPLATE[field]
        : stagedState.realizations[realizationIndex][field] !== updatedRealizationItem[field]

    debouncedInput(updatedRealizationItem, fieldIsModified, field)
  }

  const handleTemplateSelect = template => {
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
