import Actions from '@/components/modal/actions/Actions'

import { createComponent } from '@/components/common/factory/createComponent'

const createActions = (props, name) => createComponent(Actions, props, name)()

const createModal = ({ Actions, Content, Title, minWidth }) => ({
  title: createComponent(Title),
  content: createComponent(Content),
  actions: createComponent(Actions),
  minWidth,
})

export { createActions, createModal }
