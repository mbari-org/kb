import { use } from "react"

import { createActions } from "@/components/kb/factory"

import ConceptContext from "@/contexts/concept/ConceptContext"
import ModalContext from "@/contexts/modal/ModalContext"

import { MEDIA_STATE } from "@/lib/kb/concept/media"

const CANCEL = "Cancel"
const DELETE = "Delete"

const DeleteMediaActions = ({ mediaIndex }) => {
  const { _concept, editingState, modifyConcept } = use(ConceptContext)
  const { setAlert } = use(ModalContext)

  const colors = ["main", "cancel"]
  const labels = [CANCEL, DELETE]

  const onAction = label => {
    if (label === DELETE) {
      const mediaItem = editingState["media"][mediaIndex]
      mediaItem.action = MEDIA_STATE.DELETE
      modifyConcept({ type: "SET_FIELD", update: { media: mediaItem } })
    }
    setAlert(null)
  }

  return createActions({ colors, labels, onAction }, "ConceptEditMediaActions")
}

export default DeleteMediaActions
