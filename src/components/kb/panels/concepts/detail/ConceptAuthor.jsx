import { use } from "react"

import { TextField } from "@mui/material"

import ConceptContext from "@/contexts/concept/ConceptContext"

import useConceptDetailStyle from "./useConceptDetailStyle"

const ConceptAuthor = () => {
  const {
    conceptState: { author },
    modifyConcept,
  } = use(ConceptContext)

  const infoStyle = useConceptDetailStyle("Author")

  return (
    <TextField
      {...infoStyle}
      label="Author"
      onChange={e => modifyConcept({ author: e.target.value })}
      value={author}
    />
  )
}

export default ConceptAuthor
