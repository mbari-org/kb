import { use } from "react"

import { createActions } from "@/components/kb/factory"

import ConceptContext from "@/contexts/concept/ConceptContext"
import ModalContext from "@/contexts/modal/ModalContext"

const DISCARD = "Discard"
const SAVE = "Save"

const EditMediaActions = ({ mediaIndex, formRef }) => {
  const { concept } = use(ConceptContext)
  const { setAlert } = use(ModalContext)

  // const existingMedia = concept.media[mediaIndex]

  const colors = ["cancel", "main"]
  const labels = [DISCARD, SAVE]

  const onAction = label => {
    if (label === SAVE) {
      if (formRef.current) {
        formRef.current.submitForm()
      }
    } else {
      setAlert(null)
    }
  }

  return createActions({ colors, labels, onAction }, "ConceptEditMediaActions")
}

export default EditMediaActions
