import { use } from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

import ConceptContext from "@/contexts/concept/ConceptContext"

const ConceptActionButtons = () => {
  const { editing, modified, processUpdates, setEditing } = use(ConceptContext)

  return (
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
        color={editing ? "cancel" : "main"}
        onClick={() => (editing ? processUpdates(false) : setEditing(true))}
        variant="contained"
      >
        {editing ? "Cancel" : "Edit"}
      </Button>
      <Button
        disabled={!editing || !modified}
        onClick={() => processUpdates(true)}
        variant="contained"
      >
        Save
      </Button>
    </Box>
  )
}

export default ConceptActionButtons
