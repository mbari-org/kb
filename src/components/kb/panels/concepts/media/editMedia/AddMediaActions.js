import { use } from "react"

import { createActions } from "@/components/kb/factory"

import ModalContext from "@/contexts/modal/ModalContext"

const ADD = "Add"
const DISCARD = "Discard"

const AddMediaActions = () => {
  const { setModal } = use(ModalContext)

  const colors = ["cancel", "main"]
  const labels = [DISCARD, ADD]

  const onAction = label => {
    if (label === ADD) {
      const form = document.querySelector("form")
      form?.requestSubmit()
    } else {
      setModal(null)
    }
  }

  return createActions({ colors, labels, onAction }, "ConceptEditMediaActions")
}

export default AddMediaActions
