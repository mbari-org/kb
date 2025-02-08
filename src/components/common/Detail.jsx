import { createDetailContent } from "@/components/kb/factory"

const Detail = props => {
  const { detail } = props
  const Component = createDetailContent({
    detail,
    ...props,
  })

  return <Component />
}

export default Detail
