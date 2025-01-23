import { use } from "react"

import { createActions } from "@/components/factory"

import ConceptContext from "@/contexts/concept/ConceptContext"
import ModalContext from "@/contexts/modal/ModalContext"

// import useMediaActions from "@/contexts/concept/lib/useMediaActions"

const CANCEL = "Cancel"
const DELETE = "Delete"

const DeleteMediaActions = () => {
  const { _concept, initialState, resetState } = use(ConceptContext)
  const { setAlert } = use(ModalContext)

  const colors = ["main", "cancel"]
  const labels = [CANCEL, DELETE]

  const onAction = label => {
    if (label === CANCEL) {
      resetState(initialState)
    }
    setAlert(null)
  }

  return createActions({ colors, labels, onAction }, "ConceptEditMediaActions")
}

export default DeleteMediaActions
