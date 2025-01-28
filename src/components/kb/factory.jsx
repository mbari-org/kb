import Actions from "@/components/alert/actions/Actions"
import DetailContent from "../alert/content/DetailContent"
import TextContent from "@/components/alert/content/TextContent"
import Title from "@/components/alert/Title"

const createComponent = (Component, props, name) => {
  const NamedComponent = () => <Component {...props} />
  NamedComponent.displayName = name || Component.name
  return NamedComponent
}

const createActions = (props, name) => createComponent(Actions, props, name)()
const createDetailContent = props => createComponent(DetailContent, props)
const createTextContent = props => createComponent(TextContent, props)
const createTitle = (props, name) => createComponent(Title, props, name)

const createAlert = ({ Actions, Content, Title }) => ({
  Title: createComponent(Title),
  Content: createComponent(Content),
  Actions: createComponent(Actions),
})

export {
  createActions,
  createAlert,
  createDetailContent,
  createTextContent,
  createTitle,
}
