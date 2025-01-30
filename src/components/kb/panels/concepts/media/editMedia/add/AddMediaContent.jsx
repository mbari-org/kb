import { use } from "react"

import EditMediaForm from "../EditMediaForm"

import ConceptContext from "@/contexts/concept/ConceptContext"

import { hasPrimary } from "@/lib/kb/concept/media"

const AddMediaContent = ({ mediaIndex, formRef }) => {
  const { editingState } = use(ConceptContext)
  const hasPrimaryMedia = hasPrimary(editingState.media)

  const onSubmit = () => {
    console.log("CxInc: Add Media onSubmit at mediaIndex", mediaIndex)
  }

  return (
    <EditMediaForm
      hasPrimary={hasPrimaryMedia}
      mediaItem={{}}
      ref={formRef}
      onSubmit={onSubmit}
    />
  )
}

export default AddMediaContent
