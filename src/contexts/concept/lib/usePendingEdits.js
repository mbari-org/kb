import { useCallback } from "react"

const usePendingEdits = initialState => {
  return useCallback(
    editingState => {
      const pending = {}
      Object.keys(editingState).forEach(key => {
        if (editingState[key] !== initialState[key]) {
          pending[key] = {
            initial: initialState[key],
            pending: editingState[key],
          }
        }
      })

      return pending
    },
    [initialState]
  )
}

export default usePendingEdits
