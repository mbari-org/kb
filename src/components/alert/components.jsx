import Actions from "./actions/Actions"
import ConceptNameUpdateActions from "./actions/ConceptNameUpdateActions"

import ConceptNameUpdateContent from "./content/ConceptNameUpdateContent"
import EditingStateContent from "./content/EditingStateContent"
import EditMediaContent from "./content/EditMediaContent"
import PendingEditContent from "./content/PendingEditContent"
import TextContent from "./content/TextContent"
import Title from "./Title"

const createNamedComponent = (Component, displayName, props) => {
  const NamedComponent = extraProps => <Component {...props} {...extraProps} />
  NamedComponent.displayName = displayName
  return NamedComponent
}

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
  return createNamedComponent(
    ConceptNameUpdateContent,
    "ConceptNameUpdateContent"
  )
}

const createEditingStateContent = props => {
  return createNamedComponent(EditingStateContent, "EditingStateContent", props)
}

const createEditMediaContent = props => {
  return createNamedComponent(EditMediaContent, "EditMediaContent", props)
}

const createPendingEditContent = props => {
  return createNamedComponent(PendingEditContent, "PendingEditContent", props)
}

const createTextContent = props => {
  return createNamedComponent(TextContent, "TextContent", props)
}

const createTitle = props => {
  return createNamedComponent(Title, "Title", props)
}

export {
  createActions,
  createConceptNameUpdateActions,
  createConceptNameUpdateContent,
  createEditingStateContent,
  createEditMediaContent,
  createPendingEditContent,
  createTextContent,
  createTitle,
}
