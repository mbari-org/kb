import { useCallback } from 'react'

const useProcessResult = ({
  concept,
  editingState,
  initialState,
  resetConcept,
  selectConcept,
  setEditing,
  setModified,
  showBoundary,
  updateConcept,
  updateConceptName,
}) => {
  const processDetailResult = useCallback(
    updatedConcept => {
      updateConcept(updatedConcept).then(
        () => {
          resetConcept(editingState)
        },
        error => showBoundary(error)
      )
    },
    [editingState, resetConcept, showBoundary, updateConcept]
  )

  const processErrorResult = useCallback(
    error => {
      resetConcept(initialState)
      showBoundary(error)
    },
    [resetConcept, initialState, showBoundary]
  )

  const processNameResult = useCallback(
    updatedName => {
      updateConceptName(concept, updatedName).then(
        () => selectConcept(updatedName),
        error => showBoundary(error)
      )

      // closeModal()
      setEditing(false)
      setModified(false)
    },
    [concept, selectConcept, setEditing, setModified, showBoundary, updateConceptName]
  )

  return { processDetailResult, processErrorResult, processNameResult }
}

export default useProcessResult
