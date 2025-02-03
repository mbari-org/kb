import { useCallback } from "react"

const useProcessResult = ({
  concept,
  editingState,
  initialState,
  resetState,
  selectConcept,
  setModal,
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
          resetState(editingState)
        },
        error => showBoundary(error)
      )
    },
    [editingState, resetState, showBoundary, updateConcept]
  )

  const processErrorResult = useCallback(
    error => {
      resetState(initialState)
      showBoundary(error)
    },
    [resetState, initialState, showBoundary]
  )

  const processNameResult = useCallback(
    updatedName => {
      updateConceptName(concept, updatedName).then(
        () => selectConcept(updatedName),
        error => showBoundary(error)
      )

      setModal(null)
      setEditing(false)
      setModified(false)
    },
    [
      concept,
      selectConcept,
      setModal,
      setEditing,
      setModified,
      showBoundary,
      updateConceptName,
    ]
  )

  return { processDetailResult, processErrorResult, processNameResult }
}

export default useProcessResult
