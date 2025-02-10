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

        // Certain resets force other resets.
        switch (action.field) {
          case "name":
            resetField(dispatch, "nameUpdate", initialState)
            break
          case "nameUpdate":
            resetField(dispatch, "name", initialState)
            break

          case "rankLevel":
            resetField(dispatch, "rankName", initialState)
            break
          case "rankName":
            resetField(dispatch, "rankLevel", initialState)
            break

          default:
            break
        }
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
