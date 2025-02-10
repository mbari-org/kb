import { useCallback } from "react"

import { CONCEPT } from "@/contexts/concept/lib/conceptStateReducer"

const resetField = (dispatch, field, initialState) => {
  dispatch({
    type: CONCEPT.RESET_FIELD,
    update: { field, initial: initialState[field] },
  })
}

const useModifyConcept = (dispatch, initialState, setModified) => {
  return useCallback(
    action => {
      if (action.type === CONCEPT.RESET_FIELD) {
        resetField(dispatch, action.field, initialState)
        
        // If either rank field is reset, reset the other. This prevents invalid pairings.
        action.field === "rankName" && resetField(dispatch, "rankLevel", initialState)
        action.field === "rankLevel" && resetField(dispatch, "rankName", initialState)
      } else {
        dispatch(action)
      }

      // CxTBD Check if edit has restored state. See useModifyConcept.
      setModified(true)
    },
    [dispatch, initialState, setModified]
  )
}

export default useModifyConcept
