import AlertChoices from "./AlertChoices"
import AlertContentConceptName from "./AlertContentConceptName"
import AlertContentText from "./AlertContentText"
import AlertTitle from "./AlertTitle"
import AlertContentUnsavedEdits from "./AlertContentUnsavedEdits"

const createAlertChoices = ({ choices, onChoice }) => {
  const component = () => <AlertChoices choices={choices} onChoice={onChoice} />
  component.displayName = "AlertChoices"
  return component
}

const createAlertConceptNameMessage = ({ from, to }) => {
  const component = () => <AlertContentConceptName from={from} to={to} />
  component.displayName = "AlertContentText"
  return component
}

const createErrorAlertMessage = ({ error }) => {
  const component = () => <AlertContentText text={error.message} type="error" />
  component.displayName = "AlertContentError"
  return component
}

const createTextAlertMessage = ({ text, type }) => {
  const component = () => <AlertContentText text={text} type={type} />
  component.displayName = "AlertContentText"
  return component
}

const createAlertTitle = ({ title, type }) => {
  const component = () => <AlertTitle title={title} type={type} />
  component.displayName = "AlertTitle"
  return component
}

const createUnsavedEditsAlertMessage = ({ updates }) => {
  const component = () => <AlertContentUnsavedEdits updates={updates} />
  component.displayName = "AlertContentUnsavedEdits"
  return component
}

export {
  createAlertChoices,
  createAlertConceptNameMessage,
  createErrorAlertMessage,
  createTextAlertMessage,
  createAlertTitle,
  createUnsavedEditsAlertMessage,
}
