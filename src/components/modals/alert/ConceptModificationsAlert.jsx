import {
  createAlertChoices,
  createAlertTextMessage,
  createAlertTitle,
} from "./components"

const ConceptModificationsAlert = onChoice => {
  return {
    Title: createAlertTitle({
      title: "Update Rank/Level Error",
      type: "warning",
    }),
    Message: createAlertTextMessage({
      text: "You have unsaved Concept changes.",
    }),
    Choices: createAlertChoices({
      choices: ["Discard Edits", "Continue Editing"],
      onChoice,
    }),
  }
}

export default ConceptModificationsAlert
