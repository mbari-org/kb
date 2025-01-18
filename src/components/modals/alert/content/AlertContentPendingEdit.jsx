import { createAlertContentText } from "../components"

import { prettyFormat } from "@/lib/kb/util"

const AlertContentPendingEdit = ({ field, pendingEdit }) => {
  const Description = createAlertContentText({
    sx: { mt: 2, mb: 2 },
    text: field,
  })

  const Detail = createAlertContentText({
    sx: {
      mt: 1,
      ml: 2,
      mb: 8,
      whiteSpace: "pre-wrap",
      fontFamily: "monospace",
    },
    text: prettyFormat(pendingEdit),
  })

  return (
    <>
      <Description id="alert-content-pending-edit-description" />
      <Detail id="alert-content-pending-edit-detail" />
    </>
  )
}

export default AlertContentPendingEdit
