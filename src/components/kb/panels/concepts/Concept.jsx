import { useState } from "react"

import { Box } from "@mui/material"

import ConceptActionButtons from "./info/ConceptActionButtons"
import ConceptInfo from "./info/ConceptInfo"
import ConceptMedia from "./media/ConceptMedia"
import ConceptViewToggle from "./ConceptViewToggle"

const Concept = ({ concept }) => {
  const [editable, setEditable] = useState(false)

  const handleEditCancel = () => {
    setEditable(!editable)
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
          concept={concept}
          sx={{ flexBasis: "33.33%", flexShrink: 0, overflow: "hidden" }}
        />
        <ConceptInfo concept={concept} editable={editable} />
        <ConceptViewToggle sx={{ flex: "0 0 auto", marginLeft: "auto" }} />
      </Box>
      <ConceptActionButtons
        editable={editable}
        handleEditCancel={handleEditCancel}
        setEditable={setEditable}
      />
    </Box>
  )
}

export default Concept
