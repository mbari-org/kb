import { isEmpty } from "@/lib/util"

const editsObject = (initialState, editingState) => {
  return pendingEdits(initialState, editingState).reduce(
    (edits, [field, initial, pending]) => {
      edits[field] = { initial, pending }
      return edits
    },
    {}
  )
}

const hasPendingEdits = (initialState, editingState) => {
  return !isEmpty(editsObject(initialState, editingState))
}

const pendingEdits = (initialState, editingState) => {
  return Object.keys(editingState).reduce((edits, field) => {
    if (editingState[field] !== initialState[field]) {
      edits.push([field, initialState[field], editingState[field]])
    }
    return edits
  }, [])
}

export { editsObject, hasPendingEdits }
