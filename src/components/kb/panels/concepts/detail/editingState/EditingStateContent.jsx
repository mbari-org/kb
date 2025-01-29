import { use } from "react"

import DescriptionDetail from "../DescriptionDetail"

import ConceptContext from "@/contexts/concept/ConceptContext"

import { editsDisplay } from "@/lib/kb/util"

const EditingStateContent = () => {
  const { editingState, initialState } = use(ConceptContext)

  const pendingEditsDisplay = editsDisplay(initialState, editingState)

  return (
    <DescriptionDetail
      description="You have the following unsaved edits:"
      detail={pendingEditsDisplay}
    />
  )
}

export default EditingStateContent
