import { createDetailContent } from "@/components/modal/factory"

const EditDetail = props => {
  const { detail } = props
  const Component = createDetailContent({
    detail,
    ...props,
  })

  return <Component />
}

export default EditDetail
