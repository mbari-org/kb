import { use } from "react"

import { Box } from "@mui/material"

import ConceptActionButtons from "./info/ConceptActionButtons"
import ConceptInfo from "./info/ConceptInfo"
import ConceptMedia from "./media/ConceptMedia"
import ConceptViewToggle from "./ConceptViewToggle"

import ConceptContext from "@/contexts/concept/ConceptContext"

const Concept = () => {
  const { conceptState } = use(ConceptContext)

  if (conceptState && Object.keys(conceptState).length === 0) {
    return null
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Box sx={{ display: "flex", p: 1.5, width: "100%" }}>
        <ConceptMedia
          sx={{ flexBasis: "33.33%", flexShrink: 0, overflow: "hidden" }}
        />
        <ConceptInfo />
        <ConceptViewToggle sx={{ flex: "0 0 auto", marginLeft: "auto" }} />
      </Box>
      <ConceptActionButtons />
    </Box>
  )
}

export default Concept
