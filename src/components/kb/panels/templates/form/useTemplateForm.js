import { useState } from 'react'

const useTemplateForm = ({ onChange, template, original }) => {
  const [hasSearchInput, setHasSearchInput] = useState(false)
  const updateTemplate = updater => {
    const updatedTemplate = updater(template)
    onChange(updatedTemplate, original)
  }
  const handleChange = field => event => {
    const newValue = event.target.value
    if (typeof newValue !== 'string') {
      throw new Error(`Template form field '${field}' must be a string`)
    }
    updateTemplate(currentTemplate => ({
      ...currentTemplate,
      [field]: newValue,
    }))
  }

  const handleSearchInput = event => {
    setHasSearchInput(event.target.value.trim() !== '')
  }

  return {
    handleChange,
    handleSearchInput,
    hasSearchInput,
    updateTemplate,
  }
}

export default useTemplateForm
