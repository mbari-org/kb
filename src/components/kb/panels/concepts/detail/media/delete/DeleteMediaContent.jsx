import { use } from "react"

import DetailsContent from "@/components/common/DetailsContent"
import { createComponent } from "@/components/modal/factory"

import ConceptContext from "@/contexts/concept/ConceptContext"

import { dropFields } from "@/lib/util"

const DeleteMediaContent = ({ mediaIndex }) => {
  const { editingState } = use(ConceptContext)

  const mediaItem = editingState.media[mediaIndex]

  const details = dropFields(mediaItem, [
    "action",
    "conceptName",
    "id",
    "mimeType",
  ])

  const Details = createComponent(DetailsContent, {
    details,
    sx: { ml: 1, mr: 1 },
  })

  return <Details id="delete-media-content-detail" />
}

export default DeleteMediaContent
