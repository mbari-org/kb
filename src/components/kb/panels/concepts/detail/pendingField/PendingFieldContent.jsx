import { use } from "react"

import { createTextContent } from "@/components/factory"

import ConceptContext from "@/contexts/concept/ConceptContext"

// import usePendingEdits from "@/contexts/concept/lib/usePendingEdits"

import { getFieldPendingHistory, pickFields, prettyFormat } from "@/lib/kb/util"

const PendingFieldContent = ({ field }) => {
  const { pendingHistory } = use(ConceptContext)

  const pendingFieldHistory = getFieldPendingHistory(pendingHistory, field)

  const pendingFieldValues = pickFields(pendingFieldHistory, [
    "action",
    ["oldValue", "before"],
    ["newValue", "after"],
    ["creatorName", "user"],
    ["creationTimestamp", "created"],
  ])
  const Description = createTextContent({
    sx: { mt: 2, mb: 2 },
    text: field,
  })

  const Detail = createTextContent({
    sx: {
      mt: 1,
      ml: 2,
      mb: 8,
      whiteSpace: "pre-wrap",
      fontFamily: "monospace",
    },
    text: prettyFormat(pendingFieldValues),
  })

  return (
    <>
      <Description id="alert-content-pending-edit-description" />
      <Detail id="alert-content-pending-edit-detail" />
    </>
  )
}

export default PendingFieldContent
