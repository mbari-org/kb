import { use } from "react"

import DescriptionDetail from "@/components/kb/panels/concepts/detail/DescriptionDetail"

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

  return <DescriptionDetail description="Delete Media" detail={displayValues} />
}

export default DeleteMediaContent
