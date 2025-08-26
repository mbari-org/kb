import Actions from '@/components/modal/actions/Actions'

import { createComponent } from '@/components/common/factory/createComponent'

const createActions = (props, name) => createComponent(Actions, props, name)()

const createModal = ({ Actions, Content, Title, minWidth }) => {
  const TitleComponent = createComponent(Title)
  const ContentComponent = createComponent(Content)
  const ActionsComponent = createComponent(Actions)

  return {
    actions: <ActionsComponent />,
    content: <ContentComponent />,
    minWidth,
    title: <TitleComponent />,
  }
}

export { createActions, createModal }
