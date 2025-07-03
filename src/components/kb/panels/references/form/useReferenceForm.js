import { useState } from 'react'

const useReferenceForm = ({ onChange, reference, original }) => {
  const [selectedConcept, setSelectedConcept] = useState(null)
  const [hasSearchInput, setHasSearchInput] = useState(false)

  const handleFieldChange = field => value => {
    const fieldValue =
      field === 'concepts'
        ? value
            .split(',')
            .map(c => c.trim())
            .filter(Boolean)
        : value

    const updatedReference = {
      ...reference,
      [field]: fieldValue,
    }

    onChange(updatedReference, original)
  }

  const handleConceptSelect = (_event, selectedName) => {
    setSelectedConcept(selectedName || null)
    setHasSearchInput(false)
    const updatedReference = {
      ...reference,
      selectedConcept: selectedName || '',
    }
    onChange(updatedReference, original)
  }

  const handleConceptSearchInput = (event, value) => {
    // ConceptSelect onInputChange passes (event, value)
    // We need to check if there's actual input text
    const inputValue = typeof value === 'string' ? value : event?.target?.value || ''
    setHasSearchInput(inputValue.trim() !== '')
  }

  const handleConceptDelete = conceptToDelete => {
    const currentConcepts = reference.concepts || []
    const updatedConcepts = currentConcepts.filter(c => c !== conceptToDelete)
    const updatedReference = {
      ...reference,
      concepts: updatedConcepts,
    }
    onChange(updatedReference, original)
  }

  const handleConceptAdd = conceptToAdd => {
    const currentConcepts = reference.concepts || []

    if (!currentConcepts.includes(conceptToAdd)) {
      const updatedConcepts = [...currentConcepts, conceptToAdd]
      const updatedReference = {
        ...reference,
        concepts: updatedConcepts,
        selectedConcept: '',
      }
      setSelectedConcept(null)
      onChange(updatedReference, original)
    }
  }

  return {
    handleConceptAdd,
    handleConceptDelete,
    handleConceptSearchInput,
    handleConceptSelect,
    handleFieldChange,
    hasSearchInput,
    selectedConcept,
  }
}

export default useReferenceForm
