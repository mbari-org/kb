import { useCallback } from "react"

const useProcessResult = ({
  concept,
  reset,
  selectConcept,
  showBoundary,
  updateConcept,
  updateConceptName,
  setModalAlert,
  setEditing,
  setModified,
  updatedState,
  initialState,
}) => {
  const processDetailResult = useCallback(
    updatedConcept => {
      updateConcept(updatedConcept).then(
        () => {
          // selectConcept(updatedConcept.name)
          reset(updatedState)
        },
        error => showBoundary(error)
      )
    },
    [reset, showBoundary, updateConcept, updatedState]
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

      setModalAlert(null)
      setEditing(false)
      setModified(false)
    },
    [
      concept,
      selectConcept,
      setModalAlert,
      setEditing,
      setModified,
      showBoundary,
      updateConceptName,
    ]
  )

  return { processDetailResult, processErrorResult, processNameResult }
}

export default useProcessResult