import { createComponent } from '@/components/common/factory/createComponent'

const createAppModal = ({ Actions, Content, Title, minWidth = 500 }) => ({
  title: createComponent(Title),
  content: createComponent(Content),
  actions: createComponent(Actions),
  minWidth,
})

export default createAppModal
