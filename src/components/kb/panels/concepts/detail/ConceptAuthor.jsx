import { use } from "react"

import { TextField } from "@mui/material"

import ConceptContext from "@/contexts/concept/ConceptContext"

import useConceptDetailStyle from "./useConceptDetailStyle"

const ConceptAuthor = () => {
  const {
    conceptState: { author },
    conceptUpdate,
  } = use(ConceptContext)

  const infoStyle = useConceptDetailStyle("Author")

  return (
    <TextField
      {...infoStyle}
      label="Author"
      onChange={e => conceptUpdate({ author: e.target.value })}
      value={author}
    />
  )
}

export default ConceptAuthor
