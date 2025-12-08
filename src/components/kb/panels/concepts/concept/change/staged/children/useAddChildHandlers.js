import { use, useCallback } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import useDebounce from '@/lib/hooks/useDebounce'

import { hasTrue } from '@/lib/utils'

const useAddChildHandlers = (
  formChild,
  setFormChild,
  modifiedFields,
  setModifiedFields,
  originalChild
) => {
  const { modifyConcept } = use(ConceptContext)
  const { closeModal, modalData, setModalData } = use(ConceptModalContext)

  // Debounced function to update modalData (for validation and external components)
  const debouncedUpdateModalData = useDebounce(
    useCallback(
      (updatedChild, modified) => {
        setModalData(prev => ({ ...prev, child: updatedChild, modified }))
      },
      [setModalData]
    )
  )

  const handleStage = useCallback(
    event => {
      event.preventDefault()

      const { action, child, index } = modalData

      modifyConcept({
        type: action,
        update: { child, index },
      })

      closeModal(true)
    },
    [closeModal, modalData, modifyConcept]
  )

  const handleChange = useCallback(
    field => event => {
      const value = event.target.value
      const updatedChild = {
        ...formChild,
        [field]: value,
      }

      // Immediate UI update
      setFormChild(updatedChild)

      const fieldIsModified = updatedChild[field] !== originalChild[field]

      const updatedModifiedFields = { ...modifiedFields, [field]: fieldIsModified }
      setModifiedFields(updatedModifiedFields)

      const modified = hasTrue(updatedModifiedFields)

      // Debounced modalData update (for validation, Actions component, etc.)
      debouncedUpdateModalData(updatedChild, modified)
    },
    [
      originalChild,
      formChild,
      modifiedFields,
      setFormChild,
      setModifiedFields,
      debouncedUpdateModalData,
    ]
  )

  return {
    handleChange,
    handleStage,
  }
}

export default useAddChildHandlers
