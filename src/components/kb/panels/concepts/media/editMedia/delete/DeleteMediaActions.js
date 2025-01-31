import { use } from "react"

import { createActions } from "@/components/kb/factory"

import ConceptContext from "@/contexts/concept/ConceptContext"
import ModalContext from "@/contexts/modal/ModalContext"

const CANCEL = "Cancel"
const DELETE = "Delete"

const DeleteMediaActions = ({ mediaIndex }) => {
  const { modifyConcept } = use(ConceptContext)
  const { setAlert } = use(ModalContext)

  const colors = ["main", "cancel"]
  const labels = [CANCEL, DELETE]

  const onAction = label => {
    if (label === DELETE) {
      modifyConcept({ type: "DELETE_MEDIA", update: { mediaIndex } })
    }
    setAlert(null)
  }

  return createActions({ colors, labels, onAction }, "DeleteMediaActions")
}

export default DeleteMediaActions
