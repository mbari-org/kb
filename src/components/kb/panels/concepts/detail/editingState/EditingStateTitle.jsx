import { use } from "react"

import Title from "@/components/alert/Title"

import ConceptContext from "@/contexts/concept/ConceptContext"

const EditStateTitle = () => {
  const { concept } = use(ConceptContext)

  return <Title title={`Current Edits: ${concept.name}`} />
}

export default EditStateTitle
