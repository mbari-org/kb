import { use } from "react"

import DescriptionDetail from "@/components/kb/panels/concepts/detail/DescriptionDetail"

import ConceptContext from "@/contexts/concept/ConceptContext"

// import { dropFields } from "@/lib/kb/util"

const EditMediaContent = ({ mediaIndex }) => {
  const { concept } = use(ConceptContext)

  // const mediaItem = concept.media[mediaIndex]

  // const displayValues = dropFields(mediaItem, ["conceptName", "id"])

  return <DescriptionDetail description="Edit Media" detail={{}} />
}

export default EditMediaContent
