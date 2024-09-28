import { use } from "react"

import { Typography } from "@mui/material"

import ConceptsContext from "@/contexts/concepts/ConceptsContext"

const Concepts = () => {
  const { concepts } = use(ConceptsContext)

  if (!concepts) {
    return null
  }

  return (
    <>
      <Typography align="center" sx={{ mt: 3, mb: 1 }} variant="h3">
        Concepts
      </Typography>
      <Typography align="center" variant="h5" sx={{ mt: 3, mb: 1 }}>
        Herein lies great knowledge of all ocean creatures, far and wide.
      </Typography>
    </>
  )
}

export default Concepts
