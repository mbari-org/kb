import { use } from "react"

import DescriptionDetail from "../DescriptionDetail"

import ConceptContext from "@/contexts/concept/ConceptContext"

import usePendingEdits from "@/contexts/concept/lib/usePendingEdits"

const EditingStateContent = () => {
  const { editingState, initialState } = use(ConceptContext)

  const getPendingEdits = usePendingEdits(initialState)
  const pendingEdits = getPendingEdits(editingState)

  const fieldDisplay = field => (field !== "" ? field : '""')
  const pendingEditDisplay = field => {
    const { initial, pending } = pendingEdits[field]
    return `${fieldDisplay(initial)} --> ${fieldDisplay(pending)}`
  }

  const pendingEditsDisplay = Object.keys(pendingEdits).reduce((acc, field) => {
    acc[field] = pendingEditDisplay(field)
    return acc
  }, {})

  return (
    <DescriptionDetail
      description="You have the following unsaved edits:"
      detail={pendingEditsDisplay}
    />
  )
}

export default EditingStateContent
