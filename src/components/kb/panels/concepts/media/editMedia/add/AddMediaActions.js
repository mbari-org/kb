import { use } from "react"

import { createActions } from "@/components/factory"

import ConceptContext from "@/contexts/concept/ConceptContext"
import ModalContext from "@/contexts/modal/ModalContext"

const ADD = "Add"
const DISCARD = "Discard"

const AddMediaActions = ({ mediaIndex }) => {
  const { concept } = use(ConceptContext)
  const { setAlert } = use(ModalContext)

  const colors = ["cancel", "main"]
  const labels = [DISCARD, ADD]

  const onAction = label => {
    if (label === ADD) {
      console.log("Add media at index", mediaIndex)
    }
    setAlert(null)
  }

  return createActions({ colors, labels, onAction }, "ConceptEditMediaActions")
}

export default AddMediaActions
