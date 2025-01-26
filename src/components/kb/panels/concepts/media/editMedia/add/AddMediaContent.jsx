import { use } from "react"

import EditMediaForm from "../EditMediaForm"

import ConceptContext from "@/contexts/concept/ConceptContext"

const AddMediaContent = ({ mediaIndex, formRef }) => {
  const { concept } = use(ConceptContext)

  const onSubmit = wtf => {
    console.log("onSubmit?", wtf)
  }

  return <EditMediaForm mediaItem={{}} ref={formRef} onSubmit={onSubmit} />
}

export default AddMediaContent
