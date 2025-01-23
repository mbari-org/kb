import { createTextContent } from "@/components/factory"

const DescriptionDetail = ({ description, detail }) => {
  const Description = createTextContent({
    sx: { mt: 2, mb: 2 },
    text: description,
  })

  const Detail = createTextContent({
    sx: {
      mt: 1,
      ml: 2,
      mb: 4,
      fontFamily: "monospace",
      fontSize: "1.25rem",
      fontWeight: 600,
      whiteSpace: "pre-wrap",
    },
    text: detail,
  })

  return (
    <>
      <Description id="alert-content-description" />
      <Detail id="alert-content-detail" />
    </>
  )
}

export default DescriptionDetail
