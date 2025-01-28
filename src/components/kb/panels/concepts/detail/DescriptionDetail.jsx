import { createDetailContent, createTextContent } from "@/components/kb/factory"

const DescriptionDetail = ({ description, detail }) => {
  const Description = createTextContent({
    sx: { mb: 1 },
    text: description,
  })

  const Detail = createDetailContent({ detail, sx: { ml: 1 } })

  return (
    <>
      <Description id="alert-content-description" />
      <Detail id="alert-content-detail" />
    </>
  )
}

export default DescriptionDetail
