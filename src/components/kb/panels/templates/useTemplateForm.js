import ModalContext from '@/contexts/modal/ModalContext'
import { use, useState } from 'react'

const useTemplateForm = ({ isEdit = false, onChange, template }) => {
  const { modalData } = use(ModalContext)
  const [hasSearchInput, setHasSearchInput] = useState(false)

  const checkModification = updatedTemplate => {
    if (!isEdit) return false

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
    hasSearchInput,
    handleChange,
    handleSearchInput,
  }
}

export default useTemplateForm
