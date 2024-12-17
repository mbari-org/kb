import AlertChoices from "./AlertChoices"
import AlertConceptNameMessage from "./AlertConceptNameMessage"
import ConceptModificationsAlert from "./ConceptModificationsAlert"
import AlertTextMessage from "./AlertTextMessage"
import AlertTitle from "./AlertTitle"

const createAlertChoices = ({ choices, onChoice }) => {
  const component = () => <AlertChoices choices={choices} onChoice={onChoice} />
  component.displayName = "AlertChoices"
  return component
}

const createAlertConceptNameMessage = ({ from, to }) => {
  const component = () => <AlertConceptNameMessage from={from} to={to} />
  component.displayName = "AlertTextMessage"
  return component
}

const createAlertErrorMessage = ({ error }) => {
  const component = () => <AlertTextMessage text={error.message} type="error" />
  component.displayName = "AlertErrorMessage"
  return component
}

const createAlertTextMessage = ({ text, type }) => {
  const component = () => <AlertTextMessage text={text} type={type} />
  component.displayName = "AlertTextMessage"
  return component
}

const createAlertTitle = ({ title, type }) => {
  const component = () => <AlertTitle title={title} type={type} />
  component.displayName = "AlertTitle"
  return component
}

const createConceptEditingModalAlert = ({ onChoice }) => {
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

export {
  createAlertChoices,
  createAlertConceptNameMessage,
  createAlertErrorMessage,
  createAlertTextMessage,
  createAlertTitle,
  createConceptEditingModalAlert,
}
