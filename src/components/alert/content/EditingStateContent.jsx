import { createTextContent } from "../components"

const EditingStateContent = ({ pendingEdits }) => {
  const Description = createTextContent({
    sx: { mt: 2, mb: 2 },
    text: "You have the following unsaved edits:",
  })

  const displayField = field => (field !== "" ? field : '""')

  const pendingEditText = field => {
    const { initial, pending } = pendingEdits[field]
    return `${field}: ${displayField(initial)} --> ${displayField(pending)}`
  }
  const pendingEditsText = Object.keys(pendingEdits)
    .map(pendingEditText)
    .join("\n")

  const Detail = createTextContent({
    sx: {
      mt: 1,
      ml: 2,
      mb: 8,
      whiteSpace: "pre-wrap",
      fontFamily: "monospace",
    },
    text: pendingEditsText,
  })

  return (
    <>
      <Description id="alert-content-editing-state-description" />
      <Detail id="alert-content-editing-state-detail" />
    </>
  )
}

export default EditingStateContent
