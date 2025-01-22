import Titile from "./Title"

import Actions from "./actions/Actions"
import ConceptNameUpdateActions from "./actions/ConceptNameUpdateActions"

import ConceptNameUpdateContent from "./content/ConceptNameUpdateContent"
import PendingEditContent from "./content/PendingEditContent"
import EditingStateContent from "./content/EditingStateContent"
import TextContent from "./content/TextContent"

const createActions = props => {
  const component = () => <Actions {...props} />
  component.displayName = "Actions"
  return component
}

const createConceptNameUpdateActions = () => {
  const component = () => <ConceptNameUpdateActions />
  component.displayName = "ConceptNameUpdateActions"
  return component
}

const createConceptNameUpdateContent = () => {
  const component = () => <ConceptNameUpdateContent />
  component.displayName = "ConceptNameUpdateContent"
  return component
}

const createTextContent = props => {
  const component = () => <TextContent {...props} />
  component.displayName = "TextContent"
  return component
}

const createEditingStateContent = props => {
  const component = () => <EditingStateContent {...props} />
  component.displayName = "EditingStateContent"
  return component
}

const createPendingEditContent = props => {
  const component = () => <PendingEditContent {...props} />
  component.displayName = "PendingEditContent"
  return component
}

const createTitile = props => {
  const component = () => <Titile {...props} />
  component.displayName = "Titile"
  return component
}

export {
  createActions,
  createConceptNameUpdateActions,
  createConceptNameUpdateContent,
  createEditingStateContent,
  createPendingEditContent,
  createTextContent,
  createTitile,
}
