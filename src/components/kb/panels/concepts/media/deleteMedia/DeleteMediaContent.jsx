import { use } from "react"

import DescriptionDetail from "@/components/kb/panels/concepts/detail/DescriptionDetail"

import ConceptContext from "@/contexts/concept/ConceptContext"

import { dropFields, prettyFormat } from "@/lib/kb/util"

const DeleteMediaContent = ({ mediaIndex }) => {
  const { concept } = use(ConceptContext)

  const mediaItem = concept.media[mediaIndex]

  const displayValues = dropFields(mediaItem, ["conceptName", "id"])

  return (
    <DescriptionDetail
      description="Delete Media"
      detail={prettyFormat(displayValues)}
    />
  )
}

export default DeleteMediaContent
