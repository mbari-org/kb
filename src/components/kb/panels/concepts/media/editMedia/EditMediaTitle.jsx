import { use } from "react"

import Title from "@/components/alert/Title"

import ConceptContext from "@/contexts/concept/ConceptContext"

const EditMediaTitle = ({ action }) => {
  const { concept } = use(ConceptContext)
  return <Title title={`${action} Media: ${concept.name}`} />
}

EditMediaTitle.displayName = "EditMediaTitle"

export default EditMediaTitle
