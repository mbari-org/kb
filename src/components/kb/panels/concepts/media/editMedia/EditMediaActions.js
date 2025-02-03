import { use } from "react"

import { createActions } from "@/components/kb/factory"

import ModalContext from "@/contexts/modal/ModalContext"

const DISCARD = "Discard"
const SAVE = "Save"

const EditMediaActions = () => {
  const { data, setModal } = use(ModalContext)

  const colors = ["cancel", "main"]
  const disabled = [false, !data?.dirty]
  const labels = [DISCARD, SAVE]

  const onAction = label => {
    if (label === SAVE) {
      const form = document.querySelector("form")
      form?.requestSubmit()
    } else {
      setModal(null)
    }
  }

  return createActions(
    { colors, disabled, labels, onAction },
    "ConceptEditMediaActions"
  )
}

export default EditMediaActions
