import { createComponent } from "@/components/modal/factory"

import DetailsContent from "@/components/common/DetailsContent"

const Detail = props => {
  const { detail } = props
  const Component = createComponent(DetailsContent, {
    detail,
    ...props,
  })

  return <Component />
}

export default Detail
