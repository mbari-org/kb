import AlertChoices from "./AlertChoices"
import AlertConceptNameMessage from "./AlertConceptNameMessage"
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

export {
  createAlertChoices,
  createAlertConceptNameMessage,
  createAlertTextMessage,
  createAlertTitle,
}
