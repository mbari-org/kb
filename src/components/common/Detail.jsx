import { createDetailContent } from "@/components/modal/factory"

const Detail = props => {
  const { detail } = props
  const Component = createDetailContent({
    detail,
    ...props,
  })

  return <Component />
}

export default Detail
