import { use, useCallback, useContext } from "react"

import {
  createAlertButtons,
  createAlertContentEditingState,
  createAlertTitle,
} from "@/components/modals/alert/components"

import ModalContext from "@/contexts/modal/ModalContext"
import SelectedContext from "@/contexts/selected/SelectedContext"

const CONTINUE = "Continue"
const DISCARD = "Discard"

const useDisplayEditingStateAlert = ({
  conceptName,
  editingState,
  getPendingEdits,
  initialState,
  reset,
}) => {
  const { setModalAlert } = use(ModalContext)
  const { selectConcept, selectPanel } = useContext(SelectedContext)

  const dispalyEditingStateAlert = useCallback(() => {
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
      setModalAlert(null)
    }

    setModalAlert({
      Title: createAlertTitle({ title: `Current Edits: ${conceptName}` }),
      Content: createAlertContentEditingState({ pendingEdits }),
      Choices: createAlertButtons({
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
    setModalAlert,
    editingState,
  ])

  return dispalyEditingStateAlert
}

export default useDisplayEditingStateAlert
