import Actions from '@/components/modal/actions/Actions'
import Text from '@/components/common/factory/Text'
import Title from '@/components/common/factory/Title'

const createComponent = (Component, props, name) => {
  const NamedComponent = () => <Component {...props} />
  NamedComponent.displayName = name || Component.name
  return NamedComponent
}

const createActions = (props, name) => createComponent(Actions, props, name)()
const createTextContent = props => createComponent(Text, props)
const createTitle = (props, name) => createComponent(Title, props, name)

const createModal = ({ Actions, Content, Title, minWidth }) => ({
  Title: createComponent(Title),
  Content: createComponent(Content),
  Actions: createComponent(Actions),
  minWidth,
})

export { createActions, createComponent, createModal, createTextContent, createTitle }
