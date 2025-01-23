import { use } from "react"

import Title from "@/components/alert/Title"

import ConceptContext from "@/contexts/concept/ConceptContext"

const EditMediaTitle = () => {
  const { concept } = use(ConceptContext)

  return <Title title={`Concept Media: ${concept.name}`} />
}

export default EditMediaTitle
