import { useCallback } from "react"

const useModifyConcept = (editingState, initialState, dispatch) => {
  return useCallback(
    action => {
      dispatch(action)

      // const mediaIndex = action.update.mediaIndex

      // // If the edit undoes all previous edits, the concept is not modified
      // if (
      //   action.type === CONCEPT.MEDIA_EDIT &&
      //   editingState.media[mediaIndex].action === CONCEPT.MEDIA_EDIT
      // ) {
      //   const initialMediaItem = dropFields(initialState.media[mediaIndex], [
      //     "action",
      //   ])
      //   const updateMediaItem = dropFields(action.update.mediaItem, ["action"])

      //   if (isEqual(initialMediaItem, updateMediaItem)) {
      //     // setModified(hasPendingEdits(initialState, editingState))
      //   }
      // }
    },
    [dispatch]
  )
}

export default useModifyConcept
