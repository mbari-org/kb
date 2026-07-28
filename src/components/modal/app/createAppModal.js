import { createComponent } from '@/components/common/factory/createComponent'

const createAppModal = ({
  Actions,
  Content,
  Title,
  minWidth = 500,
  maxWidth,
  width,
  focusClose = false,
  contentSx,
}) => ({
  title: createComponent(Title),
  content: createComponent(Content),
  actions: Actions ? createComponent(Actions) : undefined,
  contentSx,
  minWidth,
  maxWidth,
  width,
  focusClose,
})

export default createAppModal
