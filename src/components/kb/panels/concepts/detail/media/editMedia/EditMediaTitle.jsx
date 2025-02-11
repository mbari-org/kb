import { use } from "react"

import Title from "@/components/modal/Title"

import ConceptContext from "@/contexts/concept/ConceptContext"

const EditMediaTitle = ({ action }) => {
  const { concept } = use(ConceptContext)

  const actionText = action
    .split("_")[1]
    .toLowerCase()
    .replace(/^\w/, c => c.toUpperCase())

  return <Title title={`${actionText} Media: ${concept.name}`} />
}

EditMediaTitle.displayName = "EditMediaTitle"

export default EditMediaTitle
