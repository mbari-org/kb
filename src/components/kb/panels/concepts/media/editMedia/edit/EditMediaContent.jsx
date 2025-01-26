import { use } from "react"

import EditMediaForm from "../EditMediaForm"

import ConceptContext from "@/contexts/concept/ConceptContext"

const EditMediaContent = ({ mediaIndex, formRef }) => {
  const { concept } = use(ConceptContext)

  const mediaItem = concept.media[mediaIndex]

  const onSubmit = wtf => {
    console.log("onSubmit?", wtf)
  }

  return (
    <EditMediaForm mediaItem={mediaItem} ref={formRef} onSubmit={onSubmit} />
  )
}

export default EditMediaContent
