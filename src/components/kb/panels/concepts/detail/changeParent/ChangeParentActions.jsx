import { use } from "react"

import { createActions } from "@/components/kb/factory"

import ModalContext from "@/contexts/modal/ModalContext"

const DISCARD = "Discard"
const SAVE = "Save"

const ChangeParentActions = () => {
  // const { concept, editingState } = use(ConceptContext)
  const { setModal } = use(ModalContext)

  const colors = ["cancel", "main"]
  const disabled = [false, true]
  const labels = [DISCARD, SAVE]

  const onAction = label => {
    if (label === SAVE) {
      console.log("save")
      // processUpdates()
    }

    setModal(null)
  }

  return createActions(
    { colors, disabled, labels, onAction },
    "ConceptNameUpdateActions"
  )
}

export default ChangeParentActions
