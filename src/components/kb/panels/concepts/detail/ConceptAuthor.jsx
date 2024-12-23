import { use } from "react"

import { TextField } from "@mui/material"
// import { useTheme } from "@mui/material/styles"

import ConceptContext from "@/contexts/concept/ConceptContext"

const ConceptAuthor = ({ infoStyle }) => {
  const {
    conceptState: { author },
    conceptUpdate,
  } = use(ConceptContext)

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
