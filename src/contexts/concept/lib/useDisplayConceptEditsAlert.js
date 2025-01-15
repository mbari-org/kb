import { use, useCallback, useContext } from "react"

import {
  createAlertButtons,
  createAlertContentUnsavedEdits,
  createAlertTitle,
} from "@/components/modals/alert/components"

import ModalContext from "@/contexts/modal/ModalContext"
import SelectedContext from "@/contexts/selected/SelectedContext"

const CONTINUE = "Continue"
const DISCARD = "Discard"

const useDisplayConceptEditsAlert = ({
  conceptName,
  getCurrentUpdates,
  initialState,
  reset,
  updatedState,
}) => {
  const { setModalAlert } = use(ModalContext)
  const { selectConcept, selectPanel } = useContext(SelectedContext)

  const displayConceptEditsAlert = useCallback(() => {
    const updates = getCurrentUpdates(updatedState)
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
      Content: createAlertContentUnsavedEdits({ updates }),
      Choices: createAlertButtons({
        choices: [DISCARD, CONTINUE],
        colors: ["cancel", "main"],
        onChoice,
      }),
    })
  }, [
    conceptName,
    getCurrentUpdates,
    initialState,
    reset,
    selectConcept,
    selectPanel,
    setModalAlert,
    updatedState,
  ])

  return displayConceptEditsAlert
}

export default useDisplayConceptEditsAlert
