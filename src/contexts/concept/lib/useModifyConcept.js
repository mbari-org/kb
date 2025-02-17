import { CONCEPT } from "@/contexts/concept/lib/conceptStateReducer"
import { useCallback } from "react"
import useResetConcept from "./useResetConcept"

const RESET_TYPES = [
  CONCEPT.RESET_FIELD,
  CONCEPT.RESET_MEDIA,
  CONCEPT.RESET_MEDIA_ITEM,
]

const useModifyConcept = (dispatch, initialState) => {
  const resetConcept = useResetConcept(dispatch, initialState)

  return useCallback(
    action => {
      RESET_TYPES.includes(action.type)
        ? resetConcept(action, dispatch, initialState)
        : dispatch(action)
    },
    [dispatch, initialState, resetConcept]
  )
}

export default useModifyConcept
