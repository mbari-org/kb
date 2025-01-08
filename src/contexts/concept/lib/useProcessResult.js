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
          selectConcept(updatedConcept.name)
          reset(updatedState)
        },
        error => showBoundary(error)
      )
    },
    [reset, selectConcept, showBoundary, updateConcept, updatedState]
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
      showBoundary,
      updateConceptName,
      setEditing,
      setModified,
    ]
  )

  const processErrorResult = useCallback(
    error => {
      reset(initialState)
      showBoundary(error)
    },
    [reset, initialState, showBoundary]
  )

  return { processDetailResult, processNameResult, processErrorResult }
}

export default useProcessResult
