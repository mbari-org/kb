import { CONCEPT } from "@/contexts/concept/lib/conceptStateReducer"
import { useCallback } from "react"
import useResetConcept from "./useResetConcept"

const RESET_TYPES = [
  CONCEPT.RESET_FIELD,
  CONCEPT.RESET_MEDIA,
  CONCEPT.RESET_MEDIA_ITEM,
]

const useModifyConcept = (
  dispatch,
  editingState,
  initialState,
  setModified
) => {
  const resetConcept = useResetConcept(dispatch, initialState)

  return useCallback(
    action => {
      RESET_TYPES.includes(action.type)
        ? resetConcept(action, dispatch, initialState)
        : dispatch(action)

      // CxTBD Check if edit has restored state.
      setModified(true)
    },
    [dispatch, initialState, resetConcept, setModified]
  )
}

export default useModifyConcept
