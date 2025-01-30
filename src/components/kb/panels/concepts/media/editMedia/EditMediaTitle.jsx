import { use } from "react"

import Title from "@/components/alert/Title"

import ConceptContext from "@/contexts/concept/ConceptContext"

const EditMediaTitle = () => {
  const { concept } = use(ConceptContext)
  return <Title title={`Media: ${concept.name}`} />
}

export default EditMediaTitle
