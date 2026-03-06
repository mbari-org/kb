import { createComponent } from '@/components/common/factory/createComponent'

const createAppModal = ({ Actions, Content, Title, minWidth = 500, focusClose = false, contentSx }) => ({
  title: createComponent(Title),
  content: createComponent(Content),
  actions: Actions ? createComponent(Actions) : undefined,
  contentSx,
  minWidth,
  focusClose,
})

export default createAppModal
