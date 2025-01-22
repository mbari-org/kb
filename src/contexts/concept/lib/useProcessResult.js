import { useCallback } from "react"

const useProcessResult = ({
  concept,
  editingState,
  initialState,
  reset,
  selectConcept,
  showBoundary,
  updateConcept,
  updateConceptName,
  setAlert,
  setEditing,
  setModified,
}) => {
  const processDetailResult = useCallback(
    updatedConcept => {
      updateConcept(updatedConcept).then(
        () => {
          // selectConcept(updatedConcept.name)
          reset(editingState)
        },
        error => showBoundary(error)
      )
    },
    [editingState, reset, showBoundary, updateConcept]
  )

  const processErrorResult = useCallback(
    error => {
      reset(initialState)
      showBoundary(error)
    },
    [reset, initialState, showBoundary]
  )

  const processNameResult = useCallback(
    updatedName => {
      updateConceptName(concept, updatedName).then(
        () => selectConcept(updatedName),
        error => showBoundary(error)
      )

      setAlert(null)
      setEditing(false)
      setModified(false)
    },
    [
      concept,
      selectConcept,
      setAlert,
      setEditing,
      setModified,
      showBoundary,
      updateConceptName,
    ]
  )

  return { processDetailResult, processErrorResult, processNameResult }
}

export default useProcessResult
