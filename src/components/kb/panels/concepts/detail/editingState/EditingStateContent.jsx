import { use } from "react"

import DescriptionDetail from "../DescriptionDetail"

import ConceptContext from "@/contexts/concept/ConceptContext"

import { editsObject } from "@/lib/kb/util"

const EditingStateContent = () => {
  const { editingState, initialState } = use(ConceptContext)

  const stringDisplay = field => (field !== "" ? field : '""')
  const edits = editsObject(initialState, editingState)
  const editsDetail = Object.entries(edits).reduce(
    (acc, [field, { initial, pending }]) => {
      acc[field] = `${stringDisplay(initial)} --> ${stringDisplay(pending)}`
      return acc
    },
    {}
  )

  return (
    <DescriptionDetail
      description="You have the following unsaved edits:"
      detail={editsDetail}
    />
  )
}

export default EditingStateContent
