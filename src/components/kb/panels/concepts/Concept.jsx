import { useState } from "react"

import { Box, Button } from "@mui/material"

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
      <Box
        sx={{
          position: "absolute",
          bottom: 60,
          left: 10,
          right: 20,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          color={editable ? "secondary" : "primary"}
          onClick={handleEditCancel}
          variant="contained"
        >
          {editable ? "Cancel" : "Edit"}
        </Button>
        <Button
          color={editable ? "primary" : "secondary"}
          disabled={!editable}
          onClick={() => setEditable(false)}
          variant="contained"
        >
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default Concept
