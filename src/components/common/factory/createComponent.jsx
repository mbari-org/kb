import Detail from '@/components/common/factory/Detail'
import Text from '@/components/common/factory/Text'
import Title from '@/components/common/factory/Title'

const createComponent = (Component, props, name) => {
  const NamedComponent = () => <Component {...props} />
  NamedComponent.displayName = name || Component.name
  return NamedComponent
}

const createDetail = props => createComponent(Detail, props)
const createText = props => createComponent(Text, props)
const createTitle = (props, name) => createComponent(Title, props, name)

export { createComponent, createDetail, createText, createTitle }
