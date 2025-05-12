import { createComponent } from '@/components/modal/factory'

import DetailContent from '@/components/common/DetailContent'

const Detail = props => {
  const { detail } = props
  const Component = createComponent(DetailContent, {
    detail,
    ...props,
  })

  return <Component />
}

export default Detail
