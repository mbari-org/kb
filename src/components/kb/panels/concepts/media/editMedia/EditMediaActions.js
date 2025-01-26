import { use } from "react"

import { createActions } from "@/components/factory"

import ConceptContext from "@/contexts/concept/ConceptContext"
import ModalContext from "@/contexts/modal/ModalContext"

const ADD = "Add"
const DISCARD = "Discard"
const SAVE = "Save"

const EditMediaActions = ({ mediaIndex }) => {
  const { concept } = use(ConceptContext)
  const { setAlert } = use(ModalContext)

  const existingMedia = concept.media[mediaIndex]

  const colors = ["cancel", "main"]
  const labels = [DISCARD]
  labels.push(existingMedia ? SAVE : ADD)

  const onAction = label => {
    if (label === SAVE) {
      if (existingMedia) {
        console.log("Update media index", mediaIndex)
      } else {
        console.log("Add media at index", mediaIndex)
      }
    }
    setAlert(null)
  }

  return createActions({ colors, labels, onAction }, "ConceptEditMediaActions")
}

export default EditMediaActions
