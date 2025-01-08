import { useCallback } from "react"

import {
  createAlertButtons,
  createAlertContentUnsavedEdits,
  createAlertTitle,
} from "@/components/modals/alert/components"

const CONTINUE = "Continue"
const DISCARD = "Discard"

const useDisplayConceptEditsAlert = ({
  conceptName,
  getCurrentUpdates,
  initialState,
  reset,
  selectConcept,
  selectPanel,
  setModalAlert,
  updatedState,
}) => {
  const displayConceptEditsAlert = useCallback(() => {
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

    const createUnsavedEditsModalAlert = ({ onChoice, updates }) => {
      return {
        Title: createAlertTitle({ title: `Current Edits: ${conceptName}` }),
        Content: createAlertContentUnsavedEdits({ updates }),
        Choices: createAlertButtons({
          choices: [DISCARD, CONTINUE],
          colors: ["cancel", "main"],
          onChoice,
        }),
      }
    }

    const updates = getCurrentUpdates(updatedState)
    const conceptEditingModalAlert = createUnsavedEditsModalAlert({
      onChoice,
      updates,
    })
    setModalAlert(conceptEditingModalAlert)
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
