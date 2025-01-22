import { use, useCallback, useContext } from "react"

import {
  createActions,
  createEditingStateContent,
  createTitile,
} from "@/components/alert/components"

import ModalContext from "@/contexts/modal/ModalContext"
import SelectedContext from "@/contexts/selected/SelectedContext"

const CONTINUE = "Continue"
const DISCARD = "Discard"

const useDisplayEditingState = ({
  conceptName,
  editingState,
  getPendingEdits,
  initialState,
  reset,
}) => {
  const { setAlert } = use(ModalContext)
  const { selectConcept, selectPanel } = useContext(SelectedContext)

  const dispalyEditingState = useCallback(() => {
    const pendingEdits = getPendingEdits(editingState)
    const onChoice = choice => {
      switch (choice) {
        case DISCARD:
          reset(initialState)
          break
        case CONTINUE:
          selectConcept(conceptName)
          selectPanel("Concepts")
          break
        default:
          break
      }
      setAlert(null)
    }

    setAlert({
      Title: createTitile({ title: `Current Edits: ${conceptName}` }),
      Content: createEditingStateContent({ pendingEdits }),
      Actions: createActions({
        choices: [DISCARD, CONTINUE],
        colors: ["cancel", "main"],
        onChoice,
      }),
    })
  }, [
    conceptName,
    getPendingEdits,
    initialState,
    reset,
    selectConcept,
    selectPanel,
    setAlert,
    editingState,
  ])

  return dispalyEditingState
}

export default useDisplayEditingState
