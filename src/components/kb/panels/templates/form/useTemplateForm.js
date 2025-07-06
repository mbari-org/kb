import { useState } from 'react'

const useTemplateForm = ({ onChange, template, original }) => {
  const [hasSearchInput, setHasSearchInput] = useState(false)

  const handleChange = field => event => {
    const newValue = event.target.value
    const updatedTemplate = {
      ...template,
      [field]: newValue,
    }

    onChange(updatedTemplate, original)
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
