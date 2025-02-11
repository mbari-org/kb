import Actions from "@/components/modal/actions/Actions"
import TextContent from "@/components/modal/content/TextContent"
import Title from "@/components/modal/Title"

const createComponent = (Component, props, name) => {
  const NamedComponent = () => <Component {...props} />
  NamedComponent.displayName = name || Component.name
  return NamedComponent
}

const createActions = (props, name) => createComponent(Actions, props, name)()
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
  createTextContent,
  createTitle,
}
