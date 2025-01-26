import { use } from "react"

import { createActions } from "@/components/factory"

import ConceptContext from "@/contexts/concept/ConceptContext"
import ModalContext from "@/contexts/modal/ModalContext"

const ADD = "Add"
const DISCARD = "Discard"

const AddMediaActions = ({ mediaIndex, formRef }) => {
  const { concept } = use(ConceptContext)
  const { setAlert } = use(ModalContext)

  const colors = ["cancel", "main"]
  const labels = [DISCARD, ADD]

  const onAction = label => {
    if (label === ADD) {
      if (formRef.current) {
        formRef.current.submitForm()
      }
    } else {
      setAlert(null)
    }
  }

  return createActions({ colors, labels, onAction }, "ConceptEditMediaActions")
}

export default AddMediaActions
