import { use } from "react"

import DescriptionDetail from "../DescriptionDetail"

import ConceptContext from "@/contexts/concept/ConceptContext"

import usePendingEdits from "@/contexts/concept/lib/usePendingEdits"

const EditingStateContent = () => {
  const { editingState, initialState } = use(ConceptContext)

  const getPendingEdits = usePendingEdits(initialState)
  const pendingEdits = getPendingEdits(editingState)

  const displayField = field => (field !== "" ? field : '""')

  const pendingEditText = field => {
    const { initial, pending } = pendingEdits[field]
    return `${field}: ${displayField(initial)} --> ${displayField(pending)}`
  }
  const pendingEditsText = Object.keys(pendingEdits)
    .map(pendingEditText)
    .join("\n")

  return (
    <DescriptionDetail
      description="You have the following unsaved edits:"
      detail={pendingEditsText}
    />
  )
}

export default EditingStateContent
