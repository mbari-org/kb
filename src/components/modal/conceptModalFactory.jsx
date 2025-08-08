import Actions from '@/components/modal/actions/Actions'

import { createComponent } from '@/components/common/factory/createComponent'

const createActions = (props, name) => createComponent(Actions, props, name)()

// Return React nodes for title/content/actions so presenters render them directly
const createModal = ({ Actions, Content, Title, minWidth }) => {
  const TitleComponent = createComponent(Title)
  const ContentComponent = createComponent(Content)
  const ActionsComponent = createComponent(Actions)

  return {
    title: <TitleComponent />,
    content: <ContentComponent />,
    actions: <ActionsComponent />,
    minWidth,
  }
}

export { createActions, createModal }
