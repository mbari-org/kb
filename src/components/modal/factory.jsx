import Actions from "@/components/modal/actions/Actions"
import TextContent from "@/components/modal/content/TextContent"
import Title from "@/components/modal/Title"

import DetailContent from "@/components/kb/panels/concepts/detail/editingState/edits/DetailContent"

const createComponent = (Component, props, name) => {
  const NamedComponent = () => <Component {...props} />
  NamedComponent.displayName = name || Component.name
  return NamedComponent
}

const createActions = (props, name) => createComponent(Actions, props, name)()
const createDetailContent = props => createComponent(DetailContent, props)
const createTextContent = props => createComponent(TextContent, props)
const createTitle = (props, name) => createComponent(Title, props, name)

const createModal = ({ Actions, Content, Title }) => ({
  Title: createComponent(Title),
  Content: createComponent(Content),
  Actions: createComponent(Actions),
})

export {
  createActions,
  createComponent,
  createModal,
  createDetailContent,
  createTextContent,
  createTitle,
}
