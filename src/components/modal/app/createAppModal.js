import { createComponent } from '@/components/common/factory/createComponent'

const createAppModal = ({ Actions, Content, Title, minWidth = 500 }) => ({
  Title: createComponent(Title),
  Content: createComponent(Content),
  Actions: createComponent(Actions),
  minWidth,
})

export default createAppModal
