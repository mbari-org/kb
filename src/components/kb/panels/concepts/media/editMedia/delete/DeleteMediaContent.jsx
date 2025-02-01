import { use } from "react"

import { createDetailContent } from "@/components/kb/factory"

import ConceptContext from "@/contexts/concept/ConceptContext"

import { dropFields } from "@/lib/kb/util"

const DeleteMediaContent = ({ mediaIndex }) => {
  const { editingState } = use(ConceptContext)

  const mediaItem = editingState.media[mediaIndex]

  const displayValues = dropFields(mediaItem, [
    "action",
    "conceptName",
    "id",
    "mimeType",
  ])

  const Detail = createDetailContent({
    detail: displayValues,
    sx: { ml: 1, mr: 1 },
  })

  return <Detail id="alert-content-detail" />
}

export default DeleteMediaContent
