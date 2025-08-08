import Actions from '@/components/common/factory/Actions'
import Detail from '@/components/common/factory/Detail'
import Text from '@/components/common/factory/Text'
import Title from '@/components/common/factory/Title'

const createComponent = (Component, props, name) => {
  const NamedComponent = () => <Component {...props} />
  NamedComponent.displayName = name || Component.name
  return NamedComponent
}

const createActions = (props, name) => createComponent(Actions, props, name)()
const createDetail = props => createComponent(Detail, props)
const createText = props => createComponent(Text, props)

export { createActions, createComponent, createDetail, createText }
