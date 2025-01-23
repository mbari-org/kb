import { use } from "react"

import { createActions } from "@/components/factory"

import ConceptContext from "@/contexts/concept/ConceptContext"
import ModalContext from "@/contexts/modal/ModalContext"

const CONTINUE = "Continue"
const DISCARD = "Discard"

const EditMediaActions = () => {
  const { _concept, initialState, resetState } = use(ConceptContext)
  const { setAlert } = use(ModalContext)

  const colors = ["cancel", "main"]
  const labels = [DISCARD, CONTINUE]

  const onAction = label => {
    if (label === DISCARD) {
      resetState(initialState)
    }
    setAlert(null)
  }

  return createActions({ colors, labels, onAction }, "ConceptEditMediaActions")
}

export default EditMediaActions
