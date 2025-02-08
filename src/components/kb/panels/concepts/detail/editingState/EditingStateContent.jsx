import { use } from "react"

import { Box } from "@mui/material"
import DescriptionDetail from "../DescriptionDetail"

import ConceptContext from "@/contexts/concept/ConceptContext"

import { editsObject } from "@/lib/kb/util"

const EditingStateContent = () => {
  const { editingState, initialState } = use(ConceptContext)

  const stringDisplay = field => (field !== "" ? field : '""')

  const format = (field, initial, pending) => {
    if (field === "nameUpdate") {
      return { "name update": pending }
    }
    return {
      [field]: `${stringDisplay(initial)} --> ${stringDisplay(pending)}`,
    }
  }

  const edits = editsObject(initialState, editingState)
  const editsDetail = Object.entries(edits)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .reduce((acc, [field, { initial, pending }]) => {
      return { ...acc, ...format(field, initial, pending) }
    }, {})

  return (
    <Box minWidth={500}>
      <DescriptionDetail
        description="You have the following edits:"
        detail={editsDetail}
      />
    </Box>
  )
}

export default EditingStateContent
