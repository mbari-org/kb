import { use } from "react"

import EditMediaForm from "../EditMediaForm"

import ConceptContext from "@/contexts/concept/ConceptContext"

import { hasPrimary } from "@/lib/kb/concept/media"

const EditMediaContent = ({ mediaIndex, formRef }) => {
  const { editingState } = use(ConceptContext)
  const hasPrimaryMedia = hasPrimary(editingState.media)

  const mediaItem = editingState.media[mediaIndex]

  const onSubmit = () => {
    console.log("CxInc: Add Media onSubmit at mediaIndex", mediaIndex)
  }

  return (
    <EditMediaForm
      hasPrimary={hasPrimaryMedia}
      mediaItem={mediaItem}
      ref={formRef}
      onSubmit={onSubmit}
    />
  )
}

export default EditMediaContent
