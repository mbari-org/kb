import { createAlertContentText } from "../components"

import { prettyFormat } from "@/lib/kb/util"

const AlertContentEditingState = ({ updates }) => {
  const Description = createAlertContentText({
    sx: { mt: 2, mb: 2 },
    text: "You have the following unsaved edits:",
  })

  const Detail = createAlertContentText({
    sx: {
      mt: 1,
      ml: 2,
      mb: 8,
      whiteSpace: "pre-wrap",
      fontFamily: "monospace",
    },
    text: prettyFormat(updates),
  })

  return (
    <>
      <Description id="alert-content-editing-state-description" />
      <Detail id="alert-content-editing-state-detail" />
    </>
  )
}

export default AlertContentEditingState
