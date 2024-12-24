import { useCallback } from "react"

import { useTheme } from "@mui/material/styles"

import {
  createAlertButtons,
  createAlertContentUnsavedEdits,
  createAlertTitle,
} from "@/components/modals/alert/components"

const useDisplayConceptEditsAlert = ({
  getCurrentUpdates,
  updatedState,
  setModalAlert,
  reset,
  initialState,
  selectConcept,
  conceptName,
  selectPanel,
}) => {
  const theme = useTheme()

  const displayConceptEditsAlert = useCallback(() => {
    const onChoice = choice => {
      switch (choice) {
        case "Discard Edits":
          reset(initialState)
          break
        case "Continue Editing":
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
        Title: createAlertTitle({ title: "Current Edits" }),
        Content: createAlertContentUnsavedEdits({ updates }),
        Choices: createAlertButtons({
          choices: ["Discard Edits", "Continue Editing"],
          colors: [theme.color.cancel, theme.palette.primary.main],
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
    getCurrentUpdates,
    updatedState,
    setModalAlert,
    reset,
    initialState,
    selectConcept,
    conceptName,
    selectPanel,
    theme,
  ])

  return displayConceptEditsAlert
}

export default useDisplayConceptEditsAlert
