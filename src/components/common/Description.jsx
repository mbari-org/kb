import { createTextContent } from '@/components/modal/factory'

const Description = props => {
  const { description } = props
  const Component = createTextContent({
    text: description,
    ...props,
  })

  return <Component />
}

export default Description
