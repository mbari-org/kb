import { use } from "react"

import { FormControl, TextField } from "@mui/material"

import ConceptContext from "@/contexts/concept/ConceptContext"

import useConceptDetailStyle from "./useConceptDetailStyle"

const ConceptAuthor = () => {
  const {
    editingState: { author },
    modifyConcept,
  } = use(ConceptContext)

  const infoStyle = useConceptDetailStyle("Author")

  return (
    <FormControl>
      <TextField
        {...infoStyle}
        label="Author"
        onChange={e => modifyConcept({ author: e.target.value })}
        value={author}
      />
    </FormControl>
  )
}

export default ConceptAuthor
