import { use } from "react"

import { createActions } from "@/components/kb/factory"

import ConceptContext from "@/contexts/concept/ConceptContext"
import ModalContext from "@/contexts/modal/ModalContext"
import SelectedContext from "@/contexts/selected/SelectedContext"

const CONTINUE = "Continue"
const DISCARD = "Discard"

const EditingStateActions = () => {
  const { concept, initialState, resetState } = use(ConceptContext)
  const { setModal } = use(ModalContext)
  const { selectConcept, selectPanel } = use(SelectedContext)

  const colors = ["cancel", "main"]
  const labels = [DISCARD, CONTINUE]

  const onAction = label => {
    switch (label) {
      case DISCARD:
        resetState(initialState)
        break
      case CONTINUE:
        selectConcept(concept.name)
        selectPanel("Concepts")
        break
      default:
        break
    }
    setModal(null)
  }

  return createActions(
    { colors, labels, onAction },
    "ConceptEditingStateActions"
  )
}

export default EditingStateActions
