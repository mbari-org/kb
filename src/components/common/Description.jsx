import { createTextContent } from "@/components/kb/factory"

const Description = props => {
  const { description } = props
  const Component = createTextContent({
    text: description,
    ...props,
  })

  return <Component />
}

export default Description
