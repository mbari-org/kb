import ModalContext from '@/contexts/modal/ModalContext'
import { createReference } from '@/lib/kb/model/reference'
import { isEqual } from '@/lib/util'
import { use, useState } from 'react'

const useReferenceForm = ({ isEdit = false, onChange, reference }) => {
  const { modalData } = use(ModalContext)
  const [selectedConcept, setSelectedConcept] = useState('')
  const [hasSearchInput, setHasSearchInput] = useState(false)

  const checkModification = updatedReference => {
    if (!isEdit) return false

    const originalReference = createReference(modalData.originalReference)
    const currentReference = createReference(updatedReference)

    return (
      currentReference.citation !== originalReference.citation ||
      currentReference.doi !== originalReference.doi ||
      !isEqual(currentReference.concepts, originalReference.concepts)
    )
  }

  const handleChange = field => event => {
    const newValue = event.target.value
    let updatedReference = {
      ...reference,
      [field]: newValue,
      selectedConcept,
    }

    // Convert comma-separated concepts string to array
    if (field === 'concepts') {
      updatedReference = createReference({
        ...updatedReference,
        concepts: newValue
          .split(',')
          .map(c => c.trim())
          .filter(Boolean),
      })
    }

    onChange(updatedReference, checkModification(updatedReference), hasSearchInput)
  }

  const handleConceptSelect = (_event, selectedName) => {
    setSelectedConcept(selectedName || '')
    setHasSearchInput(false)
    const updatedReference = {
      ...reference,
      selectedConcept: selectedName || '',
    }
    onChange(updatedReference, checkModification(updatedReference), false)
  }

  const handleAddConcept = () => {
    if (selectedConcept) {
      const concepts = reference.concepts || []
      if (!concepts.includes(selectedConcept)) {
        const updatedReference = createReference({
          ...reference,
          concepts: [...concepts, selectedConcept],
          selectedConcept: '',
        })
        onChange(updatedReference, checkModification(updatedReference), false)
      }
      setSelectedConcept('')
    }
  }

  const handleDeleteConcept = () => {
    if (selectedConcept) {
      const concepts = reference.concepts || []
      const updatedReference = createReference({
        ...reference,
        concepts: concepts.filter(c => c !== selectedConcept),
        selectedConcept: '',
      })
      onChange(updatedReference, checkModification(updatedReference), false)
      setSelectedConcept('')
    }
  }

  const handleKeyUp = (event, taxonomyNames) => {
    if (event.key === 'Enter') {
      const conceptName = event.target.value.trim()
      if (taxonomyNames.includes(conceptName)) {
        setSelectedConcept(conceptName)
        setHasSearchInput(false)
        document.activeElement.blur()
      }
    }
  }

  const handleSearchInput = event => {
    setHasSearchInput(event.target.value.trim() !== '')
  }

  return {
    selectedConcept,
    hasSearchInput,
    handleChange,
    handleConceptSelect,
    handleAddConcept,
    handleDeleteConcept,
    handleKeyUp,
    handleSearchInput,
  }
}

export default useReferenceForm
