import AlertTitle from "./AlertTitle"

import AlertButtons from "./buttons/AlertButtons"
import AlertButtonsConceptNameUpdate from "./buttons/AlertButtonsConceptNameUpdate"

import AlertContentConceptNameUpdate from "./content/AlertContentConceptNameUpdate"
import AlertContentPendingEdit from "./content/AlertContentPendingEdit"
import AlertContentUnsavedEdits from "./content/AlertContentUnsavedEdits"
import AlertContentText from "./content/AlertContentText"

const createAlertButtons = props => {
  const component = () => <AlertButtons {...props} />
  component.displayName = "AlertButtons"
  return component
}

const createAlertButtonsConceptNameUpdate = () => {
  const component = () => <AlertButtonsConceptNameUpdate />
  component.displayName = "AlertButtonsConceptNameUpdate"
  return component
}

const createAlertContentConceptNameUpdate = () => {
  const component = () => <AlertContentConceptNameUpdate />
  component.displayName = "AlertContentConceptNameUpdate"
  return component
}

const createAlertContentText = props => {
  const component = () => <AlertContentText {...props} />
  component.displayName = "AlertContentText"
  return component
}

const createAlertContentUnsavedEdits = props => {
  const component = () => <AlertContentUnsavedEdits {...props} />
  component.displayName = "AlertContentUnsavedEdits"
  return component
}

const createAlertContentPendingEdit = props => {
  const component = () => <AlertContentPendingEdit {...props} />
  component.displayName = "AlertContentPendingEdit"
  return component
}

const createAlertTitle = props => {
  const component = () => <AlertTitle {...props} />
  component.displayName = "AlertTitle"
  return component
}

export {
  createAlertButtons,
  createAlertButtonsConceptNameUpdate,
  createAlertContentConceptNameUpdate,
  createAlertContentPendingEdit,
  createAlertContentText,
  createAlertTitle,
  createAlertContentUnsavedEdits,
}
