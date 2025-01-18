import { useCallback } from "react"

const usePendingEdits = initialState => {
  const pendingEdits = useCallback(
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
  return pendingEdits
}

export default usePendingEdits
