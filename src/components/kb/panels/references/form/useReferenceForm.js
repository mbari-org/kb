import { use, useState } from 'react'

import ModalContext from '@/contexts/modal/ModalContext'

import { createReference } from '@/lib/kb/model/reference'

import { isEqual } from '@/lib/util'

const useReferenceForm = ({ isEdit = false, onChange, reference }) => {
  const { modalData } = use(ModalContext)

  const [selectedConcept, setSelectedConcept] = useState(null)
  const [hasSearchInput, setHasSearchInput] = useState(false)

  const checkModification = updatedReference => {
    if (!isEdit) return false

    const originalReference = createReference(modalData.originalReference)
    const currentReference = createReference(updatedReference)

    return (
      currentReference.citation !== originalReference.citation ||
      currentReference.doi !== originalReference.doi ||
      !isEqual(currentReference.concepts?.sort(), originalReference.concepts?.sort())
    )
  }

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

    onChange(updatedReference, checkModification(updatedReference), hasSearchInput)
  }

  const handleConceptSelect = (_event, selectedName) => {
    setSelectedConcept(selectedName || null)
    setHasSearchInput(false)
    const updatedReference = {
      ...reference,
      selectedConcept: selectedName || '',
    }
    onChange(updatedReference, checkModification(updatedReference), false)
  }

  const handleAddConcept = addConcept => {
    if (addConcept) {
      const concepts = reference.concepts || []
      if (!concepts.includes(addConcept)) {
        const updatedReference = createReference({
          ...reference,
          concepts: [...concepts, addConcept],
          selectedConcept: '',
        })
        onChange(updatedReference, checkModification(updatedReference), false)
      }
    }
    setSelectedConcept(null)
    document.activeElement.blur()
    return false
  }

  const handleDeleteConcept = deleteConcept => {
    if (deleteConcept) {
      const concepts = reference.concepts || []
      const updatedReference = createReference({
        ...reference,
        concepts: concepts.filter(c => c !== deleteConcept),
        selectedConcept: '',
      })
      onChange(updatedReference, checkModification(updatedReference), false)
      setSelectedConcept(null)
    }
  }

  const onEnter = () => {
    setHasSearchInput(false)
  }

  const handleSearchInput = event => {
    setHasSearchInput(event.target.value.trim() !== '')
  }

  return {
    handleFieldChange,
    handleConceptSelect,
    handleAddConcept,
    handleDeleteConcept,
    handleSearchInput,
    hasSearchInput,
    selectedConcept,
    onEnter,
  }
}

export default useReferenceForm
