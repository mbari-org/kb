import { use, useState } from 'react'

import PanelModalContext from '@/contexts/modal/PanelModalContext'

import { createReference } from '@/lib/kb/model/reference'

import { isEqual } from '@/lib/utils'

const useReferenceForm = ({ isEdit = false, onChange, reference }) => {
  const { modalData } = use(PanelModalContext)

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

  const handleConceptSearchInput = event => {
    setHasSearchInput(event.target.value.trim() !== '')
  }

  const handleConceptDelete = conceptToDelete => {
    const updatedConcepts = reference.concepts.filter(c => c !== conceptToDelete)
    const updatedReference = {
      ...reference,
      concepts: updatedConcepts,
    }
    onChange(updatedReference, checkModification(updatedReference), hasSearchInput)
  }

  const handleConceptAdd = conceptToAdd => {
    if (!reference.concepts.includes(conceptToAdd)) {
      const updatedConcepts = [...reference.concepts, conceptToAdd]
      const updatedReference = {
        ...reference,
        concepts: updatedConcepts,
        selectedConcept: '',
      }
      setSelectedConcept(null)
      onChange(updatedReference, checkModification(updatedReference), false)
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
