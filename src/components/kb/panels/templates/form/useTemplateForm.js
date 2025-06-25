import PanelModalContext from '@/contexts/modal/PanelModalContext'
import { use, useState } from 'react'

const useTemplateForm = ({ isEdit = false, onChange, template }) => {
  const { modalData } = use(PanelModalContext)
  const [hasSearchInput, setHasSearchInput] = useState(false)

  const checkModification = updatedTemplate => {
    if (!isEdit) {
      // In add mode, consider it modified if any field has a value
      return Boolean(
        updatedTemplate.concept?.trim() ||
          updatedTemplate.linkName?.trim() ||
          updatedTemplate.toConcept?.trim() ||
          updatedTemplate.linkValue?.trim()
      )
    }

    const originalTemplate = modalData.originalTemplate
    const currentTemplate = updatedTemplate

    return (
      currentTemplate.concept !== originalTemplate.concept ||
      currentTemplate.linkName !== originalTemplate.linkName ||
      currentTemplate.toConcept !== originalTemplate.toConcept ||
      currentTemplate.linkValue !== originalTemplate.linkValue
    )
  }

  const handleChange = field => event => {
    const newValue = event.target.value
    const updatedTemplate = {
      ...template,
      [field]: newValue,
    }

    onChange(updatedTemplate, checkModification(updatedTemplate), hasSearchInput)
  }

  const handleSearchInput = event => {
    setHasSearchInput(event.target.value.trim() !== '')
  }

  return {
    handleChange,
    handleSearchInput,
    hasSearchInput,
  }
}

export default useTemplateForm
