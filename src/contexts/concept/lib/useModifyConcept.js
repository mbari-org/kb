import { useCallback } from "react"

import { CONCEPT } from "@/contexts/concept/lib/conceptStateReducer"

const resetFieldValue = (dispatch, field, initialState) => {
  dispatch({
    type: CONCEPT.RESET_FIELD,
    update: { field, value: initialState[field] },
  })
}

const resetField = (dispatch, field, initialState) => {
  resetFieldValue(dispatch, field, initialState)

  // Certain resets force other resets.
  switch (field) {
    case "name":
      resetFieldValue(dispatch, "nameUpdate", initialState)
      break
    case "nameUpdate":
      resetFieldValue(dispatch, "name", initialState)
      break

    case "rankLevel":
      resetFieldValue(dispatch, "rankName", initialState)
      break
    case "rankName":
      resetFieldValue(dispatch, "rankLevel", initialState)
      break

    default:
      break
  }
}

const resetMediaItem = (dispatch, mediaIndex, initialState) => {}

const useModifyConcept = (dispatch, initialState, setModified) => {
  return useCallback(
    action => {
      switch (action.type) {
        case CONCEPT.RESET_FIELD:
          resetField(dispatch, action.field, initialState)
          break
        case CONCEPT.RESET_MEDIA:
          dispatch({
            type: CONCEPT.RESET_MEDIA,
            update: { media: initialState.media },
          })

          break

        case CONCEPT.RESET_MEDIA_ITEM:
          dispatch({
            type: CONCEPT.RESET_MEDIA_ITEM,
            update: { mediaIndex, mediaItem: initialState.media[mediaIndex] },
          })

          break
        default:
          dispatch(action)
      }

      // CxTBD Check if edit has restored state. See useModifyConcept.
      setModified(true)
    },
    [dispatch, initialState, setModified]
  )
}

export default useModifyConcept
