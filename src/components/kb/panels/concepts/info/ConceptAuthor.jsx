import { use } from "react"

import { TextField } from "@mui/material"
// import { useTheme } from "@mui/material/styles"

import ConceptEditContext from "@/contexts/concept/ConceptContext"

const ConceptAuthor = ({ infoStyle }) => {
  const {
    conceptState: { author },
    setConcept,
  } = use(ConceptEditContext)

  return (
    <TextField
      {...infoStyle}
      label="Author"
      onChange={e => setConcept({ author: e.target.value })}
      value={author}
    />
  )
}

export default ConceptAuthor
